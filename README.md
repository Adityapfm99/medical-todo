# Medical todo Application

A medical application that allows users to register, log in, and access various healthcare-related features.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup Instructions](#setup-instructions)
3. [Database Migration and Seeding](#database-migration-and-seeding)
4. [Entity-Relationship Diagram (ERD)](#entity-relationship-diagram-erd)
5. [Interactive API Documentation with Swagger](#interactive-api-documentation-with-swagger)
6. [Unit Testing](#unit-testing)
7. [Features](#features)

## Prerequisites

- **Node.js**: Ensure Node.js (>= 16.x) is installed on your machine.
- **Database**: PostgreSQL (>= 13.x) is required.
- **Package Manager**: npm or yarn.

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Adityapfm99/medical-todo
   cd medical-app
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and configure the following variables:
   ```env
        DB_USER=
        DB_PASSWORD=
        DB_HOST=
        DB_PORT=
        DB_NAME=
        JWT_SECRET=
        JWT_SECRET=
   ```

4. **Start the Application**:
   ```bash
   npm start
   ```
   Access the application at `http://localhost:3000`.


## Database Migration and Seeding

1. **Run Migrations**:
   Create the necessary database tables using the provided migration scripts:
   ```bash
   npm run migrate
   ```
   ![Alt text](backend/src/img/migrate.png)

2. **Seed initial data**:
    Populate the database with initial data:
   ```bash
   npm run seed:users
   ```
   ![Alt text](backend/src/img/seeds.png)
   

## Entity-Relationship Diagram (ERD)
   Below is relationship diagram

   ![Alt text](backend/src/img/erd.png)
   
   Explanation of Relationships

   ```bash

      Users and Todos:
      * A one-to-many relationship: Each user (creator) can create multiple todos. The created_by column in the todos table references the id column in the users table.
      Users and Todo_Users:
      * A many-to-many relationship: A todo can be assigned to multiple users, and a user can have multiple todos assigned to them. This relationship is represented by the todo_users table, which has foreign keys referencing both the users and todos tables.
      Patients and Users (Doctors):
      * A many-to-many relationship: Each patient can have multiple associated doctors, and each doctor can be associated with multiple patients. This is represented by the patient_doctors table, with foreign keys referencing patients and users.
      Patients:
      * The associated_doctors column in the patients table stores an array of doctor IDs. This provides quick access to associated doctors but is complemented by the patient_doctors table for maintaining integrity and relationships.
   ```
   ## Interactive API Documentation with Swagger
   This application includes Swagger for API documentation, providing an interactive interface to explore and test the available endpoints.

   ### Access Swagger UI

   1. Ensure the application is running locally or on a server.
   2. Navigate to the following URL in your browser:
      ```
      http://localhost:3000/api-docs
      ```

   ![Alt text](backend/src/img/swagger.png)

   ### Features of Swagger

   - **Interactive Documentation**: Test API endpoints directly from the browser.
   - **Detailed Descriptions**: Provides detailed descriptions of endpoints, request parameters, and responses.
   - **Error Responses**: Includes information on possible error codes and their meanings.

   ### Adding Endpoints to Swagger

   Swagger is configured using a `swagger.yaml` or inline comments in the codebase. To add a new endpoint:

   1. Open the Swagger configuration file (e.g., `swagger.yaml`) or modify annotations in your route files.
   2. Add the endpoint details, such as method, parameters, and responses.
   3. Restart the application to reflect the changes in the Swagger UI.

   Example endpoint definition:
   ```yaml
   /api/todos:
      get:
         summary: Retrieve all to-dos
         responses:
         '200':
            description: A list of to-dos
   ```