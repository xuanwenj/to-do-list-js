const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const clearButton = document.getElementById("clear-button");
const pendingCountSpan = document.getElementById("pending-count");
const completedCountSpan = document.getElementById("completed-count");
const totalCountSpan = document.getElementById("total-count");

// Load tasks from localStorage on page load
window.addEventListener("DOMContentLoaded", function () {
  let todos = JSON.parse(localStorage.getItem("savedtasks")) || [];
  todos.forEach((task) => {
    displayTask(task); // Use displayTask instead of addTask
  });

  // Restore counts from localStorage
  pendingCountSpan.textContent = localStorage.getItem("pendingCount") || 0;
  completedCountSpan.textContent = localStorage.getItem("completedCount") || 0;
  totalCountSpan.textContent = localStorage.getItem("totalCount") || 0;
});

function saveTasktoLocalStorage(type, newTaskValue, oldTaskValueOrElement) {
  switch (type) {
    case "add":
      let todos = JSON.parse(localStorage.getItem("savedtasks")) || [];
      todos.push(newTaskValue);
      localStorage.setItem("savedtasks", JSON.stringify(todos));
      console.log("All tasks array:", todos);
      todos.forEach((savedtask) => {
        console.log("Single task:", savedtask);
      });
      break;
    case "delete":
      let deletedtodos = JSON.parse(localStorage.getItem("savedtasks"));
      deletedtodos = deletedtodos.filter(
        (t) => t !== oldTaskValueOrElement.querySelector("span").textContent
      );
      localStorage.setItem("savedtasks", JSON.stringify(deletedtodos));
      break;
    case "edit":
      let editedtodos = JSON.parse(localStorage.getItem("savedtasks"));
      const oldText = oldTaskValueOrElement;
      editedtodos = editedtodos.map((t) => (t === oldText ? newTaskValue : t));
      localStorage.setItem("savedtasks", JSON.stringify(editedtodos));
      break;
    //TODO: Implement 'check' case if needed in future
    default:
      console.log("Invalid operation type");
  }
}
function updateTaskCountsInLocalStorage(
  pendingChange,
  completedChange,
  totalChange
) {
  localStorage.setItem("pendingCount", parseInt(pendingChange));
  localStorage.setItem("completedCount", parseInt(completedChange));
  localStorage.setItem("totalCount", parseInt(totalChange));
}

todoForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form submission
  const newTask = todoInput.value;

  if (newTask === "") {
    alert("Please enter a task.");
    return;
  }
  todoInput.value = "";
  addTask(newTask);
});

clearButton.addEventListener("click", function (event) {
  event.preventDefault();
  todoList.innerHTML = "";
  localStorage.removeItem("savedtasks");
  pendingCountSpan.textContent = 0;
  completedCountSpan.textContent = 0;
  totalCountSpan.textContent = 0;
  updateTaskCountsInLocalStorage(0, 0, 0);
});

function addTask(task) {
  displayTask(task);
  saveTasktoLocalStorage("add", task);
  pendingCountSpan.textContent = parseInt(pendingCountSpan.textContent) + 1;
  totalCountSpan.textContent = parseInt(totalCountSpan.textContent) + 1;
  updateTaskCountsInLocalStorage(
    pendingCountSpan.textContent,
    completedCountSpan.textContent,
    totalCountSpan.textContent
  );
}

function displayTask(task) {
  const listItem = document.createElement("li");
  const taskText = document.createElement("span");
  taskText.textContent = task;
  listItem.appendChild(taskText);

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  listItem.appendChild(editButton);

  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  listItem.appendChild(checkbox);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  listItem.appendChild(deleteButton);

  todoList.appendChild(listItem);
  checkTask(taskText, checkbox);
  deleteTask(listItem, deleteButton);
  editTask(taskText, listItem, editButton);
}

function checkTask(taskText, checkbox) {
  checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
      taskText.style.textDecoration = "line-through";
      completedCountSpan.textContent =
        parseInt(completedCountSpan.textContent) + 1;
      pendingCountSpan.textContent = parseInt(pendingCountSpan.textContent) - 1;
      updateTaskCountsInLocalStorage(
        pendingCountSpan.textContent,
        completedCountSpan.textContent,
        totalCountSpan.textContent
      );
    } else {
      taskText.style.textDecoration = "none";
      completedCountSpan.textContent =
        parseInt(completedCountSpan.textContent) - 1;
      pendingCountSpan.textContent = parseInt(pendingCountSpan.textContent) + 1;
      updateTaskCountsInLocalStorage(
        pendingCountSpan.textContent,
        completedCountSpan.textContent,
        totalCountSpan.textContent
      );
    }
  });
}
function deleteTask(listItem, deleteButton) {
  deleteButton.addEventListener("click", function () {
    todoList.removeChild(listItem);
    saveTasktoLocalStorage("delete", null, listItem);
    if (listItem.querySelector("input").checked) {
      completedCountSpan.textContent =
        parseInt(completedCountSpan.textContent) - 1;
    } else {
      pendingCountSpan.textContent = parseInt(pendingCountSpan.textContent) - 1;
    }
    totalCountSpan.textContent = parseInt(totalCountSpan.textContent) - 1;
    updateTaskCountsInLocalStorage(
      pendingCountSpan.textContent,
      completedCountSpan.textContent,
      totalCountSpan.textContent
    );
  });
}

function editTask(taskText, listItem, editButton) {
  editButton.addEventListener("click", function () {
    const isEditing = listItem.classList.contains("Editing");
    if (isEditing) {
      const oldTaskText = taskText.textContent;
      const newTaskText = this.previousSibling.value;
      taskText.textContent = newTaskText;
      listItem.insertBefore(taskText, this.previousSibling);
      listItem.removeChild(this.previousSibling);
      listItem.classList.remove("Editing");
      editButton.textContent = "Edit";
      saveTasktoLocalStorage("edit", newTaskText, oldTaskText);
    } else {
      const input = document.createElement("input");
      input.type = "text";
      input.value = taskText.textContent;
      listItem.insertBefore(input, taskText);
      listItem.removeChild(taskText);
      editButton.textContent = "Save";
      listItem.classList.add("Editing");
    }
  });
}
