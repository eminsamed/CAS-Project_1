console.log("todoController.js loaded"); // Debugging

import { getTodos, createTodo, updateTodo } from "../services/todoService.js";

// Fetching data
let todos = await getTodos();
console.log("todos", todos);

let showCompleted = false; // Variable to track filter state

// Function to sort todos
const sortTodos = (criteria) => {
  todos.sort((a, b) => {
    if (criteria === "title") {
      return a.title.localeCompare(b.title);
    } else if (criteria === "importance") {
      return b.importance - a.importance;
    } else {
      return 0;
    }
  });
  renderTodos();
};

// Rendering and handling todos
const renderTodos = () => {
  const todoList = document.getElementById("todo-list");
  todoList.innerHTML = "";

  // Filter todos based on showCompleted state
  const filteredTodos = showCompleted ? todos.filter((todo) => !todo.finished) : todos;

  if (filteredTodos.length === 0) {
    todoList.innerHTML = '<div class="no-todos">Keine Todo gefunden!?</div>';
  } else {
    filteredTodos.forEach((todo) => {
      const todoItem = document.createElement("div");
      todoItem.className = `todo-item ${todo.finished ? "completed" : ""}`;
      todoItem.innerHTML = `
        <div class="todo-meta">
          <div class="todo-meta-first-container">
            <input type="checkbox" ${todo.finished ? "checked" : ""} data-id="${todo.id}">
            <span>${todo.finished ? "Completed" : "Open"}</span>
          </div>
          <div>
            <p class="todo-title">${todo.title}</p>
            <p class="todo-description">${todo.description}</p>
          </div>
        </div>
        <div>
          <span class="importance">${'<i class="fas fa-bolt"></i>'.repeat(todo.importance)}</span>
          <button class="edit-btn" data-id="${todo.id}">Edit</button>
        </div>
      `;
      todoList.appendChild(todoItem);
    });

    // Add event listeners for edit buttons and checkboxes
    document.querySelectorAll(".edit-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const id = event.target.dataset.id;
        const todo = todos.find((t) => t.id === Number(id));
        fillTodoForm(todo);
        openTodoModal();
        document.getElementById("todo-form").dataset.id = id; // Set the id for the form
        console.log("Edit button clicked, opening modal for todo ID:", id); // Debugging
      });
    });

    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.addEventListener("change", async (event) => {
        const id = event.target.dataset.id;
        const todo = todos.find((t) => t.id === Number(id));
        todo.finished = event.target.checked ? 1 : 0;
        await updateExistingTodo(todo.id, todo);
        renderTodos(); // Update the UI after changing the state
        console.log("Checkbox changed for todo ID:", id, "New finished state:", todo.finished); // Debugging
      });
    });
  }
};

// Todo modal open/close operations
const openTodoModal = () => {
  console.log("openTodoModal called"); // Debugging
  const todoModal = document.getElementById("todo-modal");
  const overlay = document.querySelector(".overlay");
  const container = document.querySelector(".container");
  todoModal.style.display = "block";
  overlay.classList.add("modal-open");
  container.classList.add("hidden");
};

const closeTodoModal = () => {
  console.log("closeTodoModal called"); // Debugging
  const todoModal = document.getElementById("todo-modal");
  const overlay = document.querySelector(".overlay");
  const container = document.querySelector(".container");
  todoModal.style.display = "none";
  overlay.classList.remove("modal-open");
  container.classList.remove("hidden");
};

const fillTodoForm = (todo) => {
  console.log("fillTodoForm called", todo); // Debugging
  const todoForm = document.getElementById("todo-form");
  todoForm.elements.title.value = todo.title;
  todoForm.elements.importance.value = todo.importance;
  todoForm.elements["due-date"].value = todo.due_date;
  todoForm.elements.finished.checked = todo.finished;
  todoForm.elements.description.value = todo.description;
};

const resetTodoForm = () => {
  console.log("resetTodoForm called"); // Debugging
  const todoForm = document.getElementById("todo-form");
  todoForm.reset();
  delete todoForm.dataset.id; // Remove the id from the form
};

// Creating a new todo
const createNewTodo = async (todo) => {
  try {
    const newTodo = await createTodo(todo);
    todos.push(newTodo);
    renderTodos();
    console.log("New todo created:", newTodo); // Debugging
  } catch (error) {
    console.error("Failed to create todo", error);
  }
};

// Updating an existing todo
const updateExistingTodo = async (id, updatedTodo) => {
  try {
    const todo = await updateTodo(id, updatedTodo);
    const index = todos.findIndex((t) => t.id === id);
    todos[index] = todo;
    renderTodos();
    console.log("Todo updated:", todo); // Debugging
  } catch (error) {
    console.error("Failed to update todo", error);
  }
};

const createTodoBtn = document.getElementById("create-todo-btn");
if (createTodoBtn) {
  createTodoBtn.addEventListener("click", openTodoModal);
  console.log("Create Todo button event listener added"); // Debugging
} else {
  console.error("Create Todo button not found");
}

const closeBtn = document.querySelector(".close-btn");
if (closeBtn) {
  closeBtn.addEventListener("click", closeTodoModal);
  console.log("Close button event listener added"); // Debugging
} else {
  console.error("Close button not found");
}

const todoForm = document.getElementById("todo-form");
if (todoForm) {
  todoForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("Form submitted"); // Debugging
    const newTodo = {
      title: todoForm.elements.title.value,
      importance: todoForm.elements.importance.value,
      due_date: todoForm.elements["due-date"].value,
      finished: todoForm.elements.finished.checked,
      description: todoForm.elements.description.value,
    };
    const id = todoForm.dataset.id;
    if (id) {
      await updateExistingTodo(Number(id), newTodo);
    } else {
      await createNewTodo(newTodo);
    }
    resetTodoForm();
    closeTodoModal();
  });
  console.log("Form event listener added"); // Debugging
} else {
  console.error("Todo form not found");
}

const updateAndOverviewBtn = document.getElementById("update-overview-btn");
if (updateAndOverviewBtn) {
  updateAndOverviewBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    console.log("Update & Overview button clicked"); // Debugging
    const newTodo = {
      title: todoForm.elements.title.value,
      importance: todoForm.elements.importance.value,
      due_date: todoForm.elements["due-date"].value,
      finished: todoForm.elements.finished.checked,
      description: todoForm.elements.description.value,
    };
    const id = todoForm.dataset.id;
    if (id) {
      await updateExistingTodo(Number(id), newTodo);
    } else {
      await createNewTodo(newTodo);
    }
    resetTodoForm();
  });
  console.log("Update & Overview button event listener added"); // Debugging
} else {
  console.error("Update & Overview button not found");
}

const overviewBtn = document.getElementById("overview-btn");
if (overviewBtn) {
  overviewBtn.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("Overview button clicked"); // Debugging
    closeTodoModal();
  });
  console.log("Overview button event listener added"); // Debugging
} else {
  console.error("Overview button not found");
}

const filterCompletedBtn = document.getElementById("filter-completed-btn");
if (filterCompletedBtn) {
  filterCompletedBtn.addEventListener("click", () => {
    showCompleted = !showCompleted;
    renderTodos();
    console.log("Filter Completed button clicked, showCompleted:", showCompleted); // Debugging
  });
  console.log("Filter Completed button event listener added"); // Debugging
} else {
  console.error("Filter Completed button not found");
}

const toggleStyleBtn = document.getElementById("toggle-style-btn");
if (toggleStyleBtn) {
  toggleStyleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    console.log("Toggle Style button clicked"); // Debugging
  });
  console.log("Toggle Style button event listener added"); // Debugging
} else {
  console.error("Toggle Style button not found");
}

// Add event listeners for sort buttons
const sortTitleBtn = document.getElementById("sort-title-btn");
if (sortTitleBtn) {
  sortTitleBtn.addEventListener("click", () => {
    sortTodos("title");
    console.log("Sort Title button clicked"); // Debugging
  });
  console.log("Sort Title button event listener added"); // Debugging
} else {
  console.error("Sort Title button not found");
}

const sortImportanceBtn = document.getElementById("sort-importance-btn");
if (sortImportanceBtn) {
  sortImportanceBtn.addEventListener("click", () => {
    sortTodos("importance");
    console.log("Sort Importance button clicked"); // Debugging
  });
  console.log("Sort Importance button event listener added"); // Debugging
} else {
  console.error("Sort Importance button not found");
}

const sortDueDateBtn = document.getElementById("sort-by-due-date");
if (sortDueDateBtn) {
  sortDueDateBtn.addEventListener("click", () => {
    sortTodos("due_date");
    console.log("Sort Due Date button clicked"); // Debugging
  });
  console.log("Sort Due Date button event listener added"); // Debugging
} else {
  console.error("Sort Due Date button not found");
}

const sortCreationDateBtn = document.getElementById("sort-by-creation-date");
if (sortCreationDateBtn) {
  sortCreationDateBtn.addEventListener("click", () => {
    sortTodos("creation_date");
    console.log("Sort Creation Date button clicked"); // Debugging
  });
  console.log("Sort Creation Date button event listener added"); // Debugging
} else {
  console.error("Sort Creation Date button not found");
}

renderTodos();
