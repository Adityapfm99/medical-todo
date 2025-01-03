import pool from "../config/database";

type TodoResource = { name: string; url: string };
type TodoAssignedUser = { id: number; name: string };
interface Todo {
  id: number;
  task: string;
  deadline: string;
  created_by: number;
  patient_id?: number;
  patient_name?: string;
  resources?: TodoResource[];
  assigned_users: TodoAssignedUser[];
}
export const createTodo = async (data: {
  task: string;
  deadline: string;
  assigned_users: number[];
  created_by: number;
  patient_id?: number;
  resources?: TodoResource[];
}) => {
  try {
    console.log("Received data:", data);
    const todoQuery = `
      INSERT INTO todos (task, deadline, created_by, patient_id, resources)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const todoValues = [
      data.task,
      data.deadline,
      data.created_by,
      data.patient_id || null,
      data.resources ? JSON.stringify(data.resources) : null,
    ];
    const todoResult = await pool.query(todoQuery, todoValues);

    const todoId = todoResult.rows[0].id;

    // Check if there are assigned users
    if (data.assigned_users.length > 0) {
      const assignmentQuery = `
        INSERT INTO todo_users (todo_id, user_id)
        VALUES ${data.assigned_users.map((_, i) => `($1, $${i + 2})`).join(", ")};
      `;
      await pool.query(assignmentQuery, [todoId, ...data.assigned_users]);
    }

    return todoResult.rows[0]; // Return the created To-Do

  } catch (error) {
    console.error("Error creating todo:", error);
    throw new Error("Failed to create todo.");
  }
};


export const getAllTodos = async (): Promise<Todo[]> => {
  try {
    const query = `
      SELECT 
        todos.*,
        COALESCE(json_agg(DISTINCT jsonb_build_object(
          'id', users.id,
          'name', users.name
        )) FILTER (WHERE users.id IS NOT NULL), '[]') AS assigned_users,
        patients.name AS patient_name,
        todos.resources
      FROM todos
      LEFT JOIN todo_users ON todos.id = todo_users.todo_id
      LEFT JOIN users ON todo_users.user_id = users.id
      LEFT JOIN patients ON todos.patient_id = patients.id
      GROUP BY todos.id, patients.name;
    `;

    console.log("Executing query:", query); // Log the query

    const result = await pool.query(query);

    console.log("Query result:", result.rows); // Log the query result

    // Parse JSON fields
    return result.rows.map((row) => ({
      ...row,
      assigned_users: Array.isArray(row.assigned_users)
        ? row.assigned_users
        : row.assigned_users
        ? JSON.parse(row.assigned_users)
        : [],
      resources: Array.isArray(row.resources)
        ? row.resources
        : row.resources
        ? JSON.parse(row.resources)
        : null,
    }));
  } catch (error) {
    console.error("Error in getAllTodos:", error);
    throw new Error("Failed to fetch todos.");
  }
};

export const getTodos = async (filters: Record<string, any>) => {
  const filterClauses: string[] = [];
  const queryValues: any[] = [];

  if (filters.task_name) {
    filterClauses.push(`todos.task ILIKE $${filterClauses.length + 1}`);
    queryValues.push(filters.task_name);
  }

  if (filters.deadline_from) {
    filterClauses.push(`todos.deadline >= $${filterClauses.length + 1}`);
    queryValues.push(filters.deadline_from);
  }

  if (filters.deadline_to) {
    filterClauses.push(`todos.deadline <= $${filterClauses.length + 1}`);
    queryValues.push(filters.deadline_to);
  }

  if (filters.assigned_user) {
    filterClauses.push(`EXISTS (
      SELECT 1 FROM todo_users
      WHERE todo_users.todo_id = todos.id AND todo_users.user_id = $${filterClauses.length + 1}
    )`);
    queryValues.push(filters.assigned_user);
  }

  const whereClause = filterClauses.length > 0 ? `WHERE ${filterClauses.join(" AND ")}` : "";

  const query = `
    SELECT 
      todos.*,
      COALESCE(json_agg(DISTINCT jsonb_build_object(
        'id', users.id,
        'name', users.name
      )) FILTER (WHERE users.id IS NOT NULL), '[]') AS assigned_users,
      patients.name AS patient_name,
      todos.resources
    FROM todos
    LEFT JOIN todo_users ON todos.id = todo_users.todo_id
    LEFT JOIN users ON todo_users.user_id = users.id
    LEFT JOIN patients ON todos.patient_id = patients.id
    ${whereClause}
    GROUP BY todos.id, patients.name;
  `;

  try {
    const result = await pool.query(query, queryValues);

    return result.rows.map((row) => ({
      ...row,
      assigned_users: Array.isArray(row.assigned_users)
        ? row.assigned_users
        : row.assigned_users
        ? JSON.parse(row.assigned_users)
        : [],
      resources: Array.isArray(row.resources)
        ? row.resources
        : row.resources
        ? JSON.parse(row.resources)
        : [],
    }));
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw new Error("Failed to fetch todos from the database.");
  }
};
// Get a single To-Do by ID
export const getTodoById = async (id: number): Promise<Todo | null> => {
  try {
    const query = `
      SELECT 
        todos.*,
        COALESCE(json_agg(DISTINCT jsonb_build_object(
          'id', users.id,
          'name', users.name
        )) FILTER (WHERE users.id IS NOT NULL), '[]') AS assigned_users,
        patients.name AS patient_name,
        todos.resources
      FROM todos
      LEFT JOIN todo_users ON todos.id = todo_users.todo_id
      LEFT JOIN users ON todo_users.user_id = users.id
      LEFT JOIN patients ON todos.patient_id = patients.id
      WHERE todos.id = $1
      GROUP BY todos.id, patients.name;
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    // Safely parse JSON fields
    const row = result.rows[0];
    return {
      ...row,
      assigned_users: Array.isArray(row.assigned_users)
        ? row.assigned_users
        : row.assigned_users
        ? JSON.parse(row.assigned_users)
        : [],
      resources: Array.isArray(row.resources)
        ? row.resources
        : row.resources
        ? JSON.parse(row.resources)
        : null,
    };
  } catch (error) {
    console.error("Error fetching todo by ID:", error);
    throw new Error("Failed to fetch todo by ID.");
  }
};
// Update an existing To-Do
export const updateTodo = async (
  id: number,
  data: {
    task: string;
    deadline: string;
    assigned_users: number[];
    resources?: TodoResource[];
  }
): Promise<Todo> => {
  try {
    const todoQuery = `
      UPDATE todos
      SET task = $1, deadline = $2, resources = $3
      WHERE id = $4
      RETURNING *;
    `;
    const todoValues = [
      data.task,
      data.deadline,
      data.resources ? JSON.stringify(data.resources) : null,
      id,
    ];
    const todoResult = await pool.query(todoQuery, todoValues);

    if (todoResult.rows.length === 0) {
      throw new Error("To-Do not found.");
    }

    // Update assigned users
    if (data.assigned_users?.length > 0) {
      const deleteAssignments = "DELETE FROM todo_users WHERE todo_id = $1;";
      await pool.query(deleteAssignments, [id]);

      const assignmentQuery = `
        INSERT INTO todo_users (todo_id, user_id)
        VALUES ${data.assigned_users.map((_, i) => `($1, $${i + 2})`).join(", ")};
      `;
      await pool.query(assignmentQuery, [id, ...data.assigned_users]);
    }

    return {
      ...todoResult.rows[0],
      assigned_users: data.assigned_users,
      resources: data.resources || [],
    };
  } catch (error) {
    console.error("Error updating todo:", error);
    throw new Error("Failed to update todo.");
  }
};
export const deleteTodo = async (id: number): Promise<Todo | null> => {
  try {
    // Delete the To-Do's assigned users first
    const deleteAssignmentsQuery = `
      DELETE FROM todo_users WHERE todo_id = $1;
    `;
    await pool.query(deleteAssignmentsQuery, [id]);

    // Delete the To-Do itself
    const deleteTodoQuery = `
      DELETE FROM todos WHERE id = $1 RETURNING *;
    `;
    const result = await pool.query(deleteTodoQuery, [id]);

    if (result.rows.length === 0) {
      return null; // To-Do not found
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error deleting To-Do:", error);
    throw new Error("Failed to delete To-Do.");
  }
};
