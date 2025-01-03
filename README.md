# Medical todo Application

A medical application that allows users to register, log in, and access various healthcare-related features.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup Instructions](#setup-instructions)
3. [Database Seeding](#database-seeding)
4. [Feature Testing](#feature-testing)
5. [Troubleshooting](#troubleshooting)

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
        DB_NAME_TEST=
        JWT_SECRET=
   ```

4. **Run Database Migrations**:
   Use the following command to apply migrations:
   ```bash
   npm run migrate
   ```

5. **Start the Application**:
   ```bash
   npm start
   ```
   Access the application at `http://localhost:3000`.

## Database Seeding

1. **Run Seed Script**:
   Use the provided seed script to populate the database with initial data:
   ```bash
   npm run seed:users
   ```
