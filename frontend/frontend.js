const container = document.getElementById("container");
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const searchInput = document.getElementById("search");
const messageContainer = document.getElementById("messageContainer");

const errorMessage = document.createElement("p");
errorMessage.textContent =
  "Task wasn't created successfully, you may have left the input empty or the task already exists";
errorMessage.style.color = "red";
errorMessage.style.display = "none";

messageContainer.appendChild(errorMessage);

const fetchingData = async () => {
  try {
    const response = await fetch("http://localhost:8080/tasks");
    if (!response.ok) {
      console.error("Failed to fetch tasks, status:", response.status);
      return [];
    }
    const text = await response.text();
    if (!text) {
      // Empty response, return empty array
      return [];
    }
    const data = JSON.parse(text);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

async function manipulateData() {
  container.innerHTML = ""; // Clear container before appending tasks
  const data = await fetchingData();
  data.forEach((task) => {
    const taskName = task.taskName;
    let taskStatus = task.status; // Use 'status' to match backend data
    const buttonDiv = document.createElement("div");
    const taskElement = document.createElement("div");
    const finishedBtn = document.createElement("button");
    const pendingBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");
    buttonDiv.className = "buttonDiv";
    finishedBtn.textContent = "finished";
    pendingBtn.textContent = "pending";
    deleteBtn.textContent = "delete";
    finishedBtn.className = "finishedBtn";
    pendingBtn.className = "pendingBtn";
    deleteBtn.className = "deleteBtn";

    taskElement.textContent = taskName;
    taskElement.classList.add("task");
    taskElement.classList.add(taskStatus);
    buttonDiv.append(finishedBtn, pendingBtn, deleteBtn);
    taskElement.append(buttonDiv);
    container.appendChild(taskElement);

    searchInput.addEventListener("input", (e) => {
      const target = e.target.value.toLowerCase();
      const searched = taskName.toLowerCase();
      const isVisible = searched.includes(target);
      taskElement.classList.toggle("hide", !isVisible);
    });

    finishedBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        const response = await fetch(
          `http://localhost:8080/updateTasksStatus/${taskName}/finished`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          taskStatus = "finished";
          taskElement.classList.remove("pending");
          taskElement.classList.add("finished");
          await manipulateData(); // Refresh UI after update
        } else {
          console.error("Failed to update task status");
        }
      } catch (error) {
        console.error(error);
      }
    });

    pendingBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        const response = await fetch(
          `http://localhost:8080/updateTasksStatus/${taskName}/pending`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          taskStatus = "pending";
          taskElement.classList.remove("finished");
          taskElement.classList.add("pending");
          await manipulateData(); // Refresh UI after update
        } else {
          console.error("Failed to update task status");
        }
      } catch (error) {
        console.error(error);
      }
    });

    deleteBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(
          `http://localhost:8080/deleteTask/${taskName}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          await manipulateData(); // Refresh UI after deletion
        } else {
          console.error("Failed to delete task");
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
);

  taskForm.addEventListener("submit", async (e) => {
    console.log("Form submit event triggered");
    e.preventDefault();
    errorMessage.style.display = "none";
    try {
      if (!taskInput.value.trim()) {
        errorMessage.textContent = "Task cannot be empty";
        errorMessage.style.display = "block";
        setTimeout(() => {
          errorMessage.style.display = "none";
        }, 7000);
        return;
      }
      const response = await fetch(
        `http://localhost:8080/addtasks/${encodeURIComponent(taskInput.value)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        errorMessage.textContent =
          "Task wasn't created successfully, it may already exist";
        errorMessage.style.display = "block";
        setTimeout(() => {
          errorMessage.style.display = "none";
        }, 7000);
        taskInput.value = "";
        throw new Error();
      } else {
        taskInput.value = "";
        await manipulateData(); // Refresh UI after adding task
        return;
      }
    } catch (error) {
      return;
    }
  });
}

manipulateData();
