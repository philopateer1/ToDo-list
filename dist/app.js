"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = require("fs");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 8080;
function ensureTasksFile() {
    return __awaiter(this, void 0, void 0, function* () {
        const initialData = { tasks: [] };
        try {
            // Ensure the data directory exists
            yield fs_1.promises.mkdir("data", { recursive: true });
            yield fs_1.promises.access("data/tasks.json");
            const content = yield fs_1.promises.readFile("data/tasks.json", "utf-8");
            if (!content || content.trim() === "") {
                yield fs_1.promises.writeFile("data/tasks.json", JSON.stringify(initialData, null, 2));
            }
        }
        catch (err) {
            // File does not exist, create it
            yield fs_1.promises.writeFile("data/tasks.json", JSON.stringify(initialData, null, 2));
        }
    });
}
ensureTasksFile();
app.use([express_1.default.json(), (0, cors_1.default)()]);
app.get('/tasks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonData = JSON.parse(yield fs_1.promises.readFile("data/tasks.json", "utf-8"));
    try {
        if (jsonData.tasks.length === 0) {
            res.status(204).send({ message: "No tasks found" });
        }
        else {
            res.status(200).send(jsonData.tasks);
        }
    }
    catch (error) {
        res.status(500).send({ message: "Error reading tasks" });
    }
}));
app.post("/addtasks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(400).json({ message: "Task cannot be empty" });
}));
app.post("/addtasks/:task", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const task = req.params.task;
    const taskObject = { taskName: task, status: "pending" };
    const tasks = JSON.parse(yield fs_1.promises.readFile("data/tasks.json", "utf-8"));
    try {
        const duplicate = tasks.tasks.find((t) => t.taskName.toLowerCase() === taskObject.taskName.toLowerCase());
        if (duplicate) {
            res.status(400).json({ message: "Task already exists" });
        }
        else if (!taskObject.taskName || taskObject.taskName.trim() === "") {
            res.status(400).json({ message: "Task cannot be empty" });
        }
        else {
            tasks.tasks.push(taskObject);
            yield fs_1.promises.writeFile("data/tasks.json", JSON.stringify(tasks, null, 2));
            res.status(201).json({ message: "Task added successfully" });
        }
    }
    catch (err) {
        res.status(400).json();
    }
}));
app.post("/updateTasksStatus/:task/:taskStatus", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const task = req.params.task;
    const taskStatus = req.params.taskStatus;
    const tasks = JSON.parse(yield fs_1.promises.readFile("data/tasks.json", "utf-8"));
    try {
        const taskIndex = tasks.tasks.findIndex((t) => t.taskName === task);
        if (taskIndex === -1) {
            res.status(404).json({ message: "Task not found" });
        }
        else {
            tasks.tasks[taskIndex].status = `${taskStatus}`;
            yield fs_1.promises.writeFile("data/tasks.json", JSON.stringify(tasks, null, 2));
            res.status(200).json({ message: "Task status updated successfully" });
        }
    }
    catch (err) {
        res.status(400).json();
    }
}));
app.post("/deleteTask/:task", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const task = req.params.task;
    const tasks = JSON.parse(yield fs_1.promises.readFile("data/tasks.json", "utf-8"));
    const index = tasks.tasks.findIndex((t) => t.taskName === task);
    try {
        if (index !== -1) {
            tasks.tasks.splice(index, 1);
            yield fs_1.promises.writeFile("data/tasks.json", JSON.stringify(tasks, null, 2));
            res.status(200).json({ message: "Task deleted successfully" });
        }
        else {
            throw new Error();
        }
    }
    catch (err) {
        res.status(400).json({ message: "Task not found to be deleted" });
    }
}));
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
