# ToDo List

A simple To-Do List application built with TypeScript, Express, and a frontend using HTML, CSS, and JavaScript. This app allows users to add tasks, update their status (pending or finished), and delete tasks. Tasks are stored in a JSON file on the server.

## Features

- Add new tasks
- View all tasks
- Update task status (pending or finished)
- Delete tasks
- Simple and clean frontend interface
- RESTful API backend with Express and TypeScript

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd todo-list
   ```

   > Note: The `node_modules` directory is ignored by the `.gitignore` file to prevent committing dependencies to the repository.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the TypeScript files:

   ```bash
   npm run build
   ```

4. Start the server:

   - For production:

     ```bash
     npm start
     ```

   - For development (with auto-reload):

     ```bash
     npm run dev
     ```

5. Open the frontend:

   Open `frontend/index.html` in your browser.

## Usage

- Use the input field on the frontend page to add a new task.
- Tasks will be displayed below the input.
- You can mark tasks as finished or pending.
- You can delete tasks you no longer need.

## API Endpoints

- `GET /tasks`  
  Returns all tasks.  
  - Response 200: Array of tasks  
  - Response 204: No tasks found

- `POST /addtasks/:task`  
  Adds a new task with the name `task`.  
  - Response 201: Task added successfully  
  - Response 400: Task already exists or task is empty

- `POST /updateTasksStatus/:task/:taskStatus`  
  Updates the status of the task named `task` to `taskStatus` (e.g., "pending" or "finished").  
  - Response 200: Task status updated successfully  
  - Response 404: Task not found

- `POST /deleteTask/:task`  
  Deletes the task named `task`.  
  - Response 200: Task deleted successfully  
  - Response 400: Task not found to be deleted

## Project Structure

```
.
├── data/
│   └── tasks.json          # JSON file storing tasks
├── frontend/
│   ├── index.html          # Frontend HTML page
│   ├── frontend.js         # Frontend JavaScript
│   └── style.css           # Frontend CSS styles
├── src/
│   └── app.ts              # Express server application
├── package.json            # Project metadata and scripts
├── package-lock.json       # Dependency lock file
└── tsconfig.json           # TypeScript configuration
```

## License

This project is licensed under the ISC License.
