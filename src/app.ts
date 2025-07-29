import express, { NextFunction, Request, Response } from 'express';
import { promises as fs } from 'fs';
import cors from 'cors';

const app = express();
const port = 8080;

async function ensureTasksFile() {
  const initialData = { tasks: [] };
  try {
    // Ensure the data directory exists
    await fs.mkdir("data", { recursive: true });

    await fs.access("data/tasks.json");
    const content = await fs.readFile("data/tasks.json", "utf-8");
    if (!content || content.trim() === "") {
      await fs.writeFile("data/tasks.json", JSON.stringify(initialData, null, 2));
    }
  } catch (err) {
    // File does not exist, create it
    await fs.writeFile("data/tasks.json", JSON.stringify(initialData, null, 2));
  }
}

ensureTasksFile();

app.use([express.json(), cors()]);

app.get('/tasks', async (req: Request, res: Response) => {
  const jsonData = JSON.parse(await fs.readFile("data/tasks.json", "utf-8"));
  try {
    if(jsonData.tasks.length === 0){
      res.status(204).send({ message: "No tasks found" });
    }else{
      res.status(200).send(jsonData.tasks);
    }
  }catch (error) {
    res.status(500).send({ message: "Error reading tasks" });
  }
});

app.post("/addtasks", async (req: Request, res: Response) => {
  res.status(400).json({ message: "Task cannot be empty" });
});

app.post("/addtasks/:task", async (req: Request, res: Response) => {
  const task = req.params.task;
  const taskObject = {taskName:task,status: "pending"}
  const tasks = JSON.parse(await fs.readFile("data/tasks.json", "utf-8"));

  try {
    const duplicate = tasks.tasks.find((t:any) => t.taskName.toLowerCase() === taskObject.taskName.toLowerCase());
    if (duplicate) {
      res.status(400).json({ message: "Task already exists" });
      }else if(!taskObject.taskName || taskObject.taskName.trim() === "") {
        res.status(400).json({ message: "Task cannot be empty" });
      }else {
        tasks.tasks.push(taskObject);
        await fs.writeFile("data/tasks.json", JSON.stringify(tasks, null, 2));
        res.status(201).json({ message: "Task added successfully" });
      }
  } catch (err) {
    res.status(400).json();
  }
});

app.post("/updateTasksStatus/:task/:taskStatus", async (req: Request, res: Response) => {
  const task = req.params.task;
  const taskStatus = req.params.taskStatus;
  const tasks = JSON.parse(await fs.readFile("data/tasks.json", "utf-8"));

  try {
    const taskIndex = tasks.tasks.findIndex((t:any) => t.taskName === task);
    if (taskIndex === -1) {
      res.status(404).json({ message: "Task not found" });
    } else {
      tasks.tasks[taskIndex].status = `${taskStatus}`;
      await fs.writeFile("data/tasks.json", JSON.stringify(tasks, null, 2));
      res.status(200).json({message: "Task status updated successfully" });
    }
  } catch (err) {
    res.status(400).json()
  }
});

app.post("/deleteTask/:task", async(req:Request,res:Response) => {
  const task = req.params.task;
  const tasks = JSON.parse(await fs.readFile("data/tasks.json", "utf-8"));
  const index = tasks.tasks.findIndex((t:any) => t.taskName === task);
  try{
    if (index !== -1) {
      tasks.tasks.splice(index, 1);
      await fs.writeFile("data/tasks.json", JSON.stringify(tasks, null, 2));
      res.status(200).json({ message: "Task deleted successfully" });
    }else{
      throw new Error();
    }
  }catch(err){
        res.status(400).json({ message: "Task not found to be deleted" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});