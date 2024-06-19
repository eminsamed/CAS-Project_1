document.addEventListener("DOMContentLoaded", () => {
  const todoList = document.getElementById("todo-list");
  const createTodoBtn = document.getElementById("create-todo-btn");
  const toggleStyleBtn = document.getElementById("toggle-style-btn");
  const filterCompletedBtn = document.getElementById("filter-completed-btn");
  const modal = document.getElementById("todo-modal");
  const closeModalBtn = document.querySelector(".close-btn");
  const todoForm = document.getElementById("todo-form");
  const createBtn = document.getElementById("create-btn");
  const createOverviewBtn = document.getElementById("create-overview-btn");
  const overviewBtn = document.getElementById("overview-btn");
  const sortByNameBtn = document.getElementById("sort-by-name");
  const sortByDueDateBtn = document.getElementById("sort-by-due-date");
  const sortByCreationDateBtn = document.getElementById("sort-by-creation-date");
  const sortByImportanceBtn = document.getElementById("sort-by-importance");
  const nameArrow = document.getElementById("name-arrow");
  const dueDateArrow = document.getElementById("due-date-arrow");
  const creationDateArrow = document.getElementById("creation-date-arrow");
  const importanceArrow = document.getElementById("importance-arrow");
  const overlay = document.querySelector(".overlay");
  const container = document.querySelector(".container");

  let todos = [];
  let isEditing = false;
  let editingIndex = null;
  let isNameAscending = true;
  let isDueDateAscending = true;
  let isCreationDateAscending = true;
  let isImportanceAscending = true;

  // Function to open the modal for creating a new todo
  function createTodo() {
    modal.style.display = "block";
    overlay.classList.add("modal-open");
    container.classList.add("hidden");
    todoForm.reset();
    isEditing = false;
    editingIndex = null;
    createBtn.textContent = "Create";
    createOverviewBtn.textContent = "Create & Overview";
  }

  // Function to close the modal
  function closeModal() {
    modal.style.display = "none";
    overlay.classList.remove("modal-open");
    container.classList.remove("hidden");
  }

  // Function to create a todo and close the modal
  function createTodoAndClose() {
    submitTodoForm(new Event("submit"));
    renderTodos();
    closeModal();
  }

  // Function to open the modal for editing an existing todo
  function editTodoForm(index) {
    const todo = todos[index];
    document.getElementById("title").value = todo.title;
    document.getElementById("importance").value = todo.importance;
    document.getElementById("due-date").value = todo.due_date;
    document.getElementById("finished").checked = todo.finished;
    document.getElementById("description").value = todo.description;
    modal.style.display = "block";
    overlay.classList.add("modal-open");
    container.classList.add("hidden");
    createBtn.textContent = "Update";
    createOverviewBtn.textContent = "Update & Overview";

    isEditing = true;
    editingIndex = index;
  }

  // Function to toggle the completion status of a todo
  function toggleTodoCompletion(index, completed) {
    todos[index].finished = completed;
    fetch(`/api/todos/${todos[index].id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todos[index]),
    })
      .then((response) => response.json())
      .then((data) => {
        todos[index] = data;
        renderTodos();
      })
      .catch((error) => {
        console.error("Error updating todo:", error);
      });
  }

  // Function to calculate the difference in days between the current date and the due date
  function getDateDifference(inputDate) {
    const selectedDate = new Date(inputDate);
    const currentDate = new Date();

    selectedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    const timeDifference = selectedDate.getTime() - currentDate.getTime();
    const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)); // milliseconds to days

    let message = "";
    if (dayDifference === 0) {
      message = "Today";
    } else if (dayDifference === 1) {
      message = "In a day";
    } else if (dayDifference > 1) {
      message = `In ${dayDifference} days`;
    } else if (dayDifference === -1) {
      message = "A day ago";
    } else {
      message = `${Math.abs(dayDifference)} days ago`;
    }

    return message;
  }

  // Function to render the todos on the page
  function renderTodos() {
    todoList.innerHTML = "";
    if (todos.length === 0) {
      const noTodoMessage = document.createElement("div");
      noTodoMessage.className = "no-todo-message";
      noTodoMessage.textContent = "No todos found!";
      todoList.appendChild(noTodoMessage);
    } else {
      todos.forEach((todo, index) => {
        const todoItem = document.createElement("div");
        todoItem.className = `todo-item ${todo.finished ? "completed" : ""}`;
        todoItem.innerHTML = `
                    <div class="todo-meta">
                      <div class="todo-meta-first-container">  
                          <span>${getDateDifference(todo.due_date) || ""}</span>
                          <br />
                          <br />
                          <input type="checkbox" ${todo.finished ? "checked" : ""}>
                          <span>${todo.finished ? "Completed" : "Open"} </span>
                      </div>
                      <div>
                          <p class="todo-title">${todo.title}</p>
                          <p class="todo-description">${todo.description}</p>
                      </div>
                    </div>
                    <div> 
                      <span class="importance">${'<i class="fas fa-bolt"></i>'.repeat(todo.importance)}</span>
                      <button class="edit-btn">Edit</button>
                    </div>
                `;
        todoItem.querySelector(".edit-btn").addEventListener("click", () => editTodoForm(index));
        todoItem
          .querySelector('input[type="checkbox"]')
          .addEventListener("change", (e) => toggleTodoCompletion(index, e.target.checked));
        todoList.appendChild(todoItem);
        if (index < todos.length - 1) {
          const hr = document.createElement("hr");
          todoList.appendChild(hr);
        }
      });
    }
  }

  // Fetch todos from server
  function fetchTodos() {
    fetch("http://127.0.0.1:3000/api/todos")
      .then((response) => response.json())
      .then((data) => {
        todos = data;
        renderTodos();
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
      });
  }

  // Function to handle form submission for creating/updating a todo
  function submitTodoForm(e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const importance = document.getElementById("importance").value;
    const due_date = document.getElementById("due-date").value;
    const finished = document.getElementById("finished").checked;
    const description = document.getElementById("description").value;

    const todo = { title, importance, due_date, finished, description };

    if (isEditing) {
      const id = todos[editingIndex].id;
      fetch(`http://127.0.0.1:3000/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      })
        .then((response) => response.json())
        .then((data) => {
          todos[editingIndex] = data;
          renderTodos();
          closeModal();
        })
        .catch((error) => {
          console.error("Error updating todo:", error);
        });
    } else {
      fetch("http://127.0.0.1:3000/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      })
        .then((response) => response.json())
        .then((data) => {
          todos.push(data);
          renderTodos();
          closeModal();
        })
        .catch((error) => {
          console.error("Error creating todo:", error);
        });
    }
  }

  // Function to sort todos by name
  function sortTodosByName() {
    todos.sort((a, b) => {
      if (isNameAscending) {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
    isNameAscending = !isNameAscending; // Toggle sort direction
    updateArrows("name");
    renderTodos();
  }

  // Function to sort todos by due date
  function sortTodosByDueDate() {
    todos.sort((a, b) => {
      if (isDueDateAscending) {
        return new Date(a.due_date) - new Date(b.due_date);
      } else {
        return new Date(b.due_date) - new Date(a.due_date);
      }
    });
    isDueDateAscending = !isDueDateAscending; // Toggle sort direction
    updateArrows("due_date");
    renderTodos();
  }

  // Function to sort todos by creation date
  function sortTodosByCreationDate() {
    todos.sort((a, b) => {
      if (isCreationDateAscending) {
        return new Date(a.creation_date) - new Date(b.creation_date);
      } else {
        return new Date(b.creation_date) - new Date(a.creation_date);
      }
    });
    isCreationDateAscending = !isCreationDateAscending; // Toggle sort direction
    updateArrows("creation_date");
    renderTodos();
  }

  // Function to sort todos by importance
  function sortTodosByImportance() {
    todos.sort((a, b) => {
      if (isImportanceAscending) {
        return a.importance - b.importance;
      } else {
        return b.importance - a.importance;
      }
    });
    isImportanceAscending = !isImportanceAscending; // Toggle sort direction
    updateArrows("importance");
    renderTodos();
  }

  // Function to update the arrows for sorting
  function updateArrows(sortedBy) {
    // Clear all arrows
    nameArrow.textContent = "";
    dueDateArrow.textContent = "";
    creationDateArrow.textContent = "";
    importanceArrow.textContent = "";

    // Show arrow on sorted column
    if (sortedBy === "name") {
      nameArrow.textContent = isNameAscending ? "▼" : "▲";
    } else if (sortedBy === "due_date") {
      dueDateArrow.textContent = isDueDateAscending ? "▼" : "▲";
    } else if (sortedBy === "creation_date") {
      creationDateArrow.textContent = isCreationDateAscending ? "▼" : "▲";
    } else if (sortedBy === "importance") {
      importanceArrow.textContent = isImportanceAscending ? "▼" : "▲";
    }
  }

  // Event listeners
  createTodoBtn.addEventListener("click", createTodo);
  closeModalBtn.addEventListener("click", closeModal);
  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      closeModal();
    }
  });
  todoForm.addEventListener("submit", submitTodoForm);
  createOverviewBtn.addEventListener("click", createTodoAndClose);
  toggleStyleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    document.body.style.backgroundColor = document.body.classList.contains("dark-mode") ? "#000" : "#f4f4f4";
  });
  filterCompletedBtn.addEventListener("click", () => {
    todos = todos.filter((todo) => !todo.finished);
    renderTodos();
  });
  sortByNameBtn.addEventListener("click", sortTodosByName);
  sortByDueDateBtn.addEventListener("click", sortTodosByDueDate);
  sortByCreationDateBtn.addEventListener("click", sortTodosByCreationDate);
  sortByImportanceBtn.addEventListener("click", sortTodosByImportance);
  overviewBtn.addEventListener("click", () => {
    renderTodos();
    closeModal();
  });

  // Initial rendering
  fetchTodos();
  updateArrows("name");
});
