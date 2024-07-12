const input = document.querySelector("input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter");
let filter = '';

showTodos();

function getTodoHtml(todo, index) {
  if (filter && filter !== 'all' && filter !== todo.status) {
    return '';
  }
  let checked = todo.status === "completed" ? "checked" : "";
  return /* html */ `
    <li class="todo">
      <label for="${index}">
        <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
        <span class="${checked}">${todo.name}</span>
        <span class="timestamp">${todo.status === "completed" ? "Completed on: " + todo.completedAt : "Added on: " + todo.addedAt}</span>
      </label>
      <button class="edit-btn" data-index="${index}" onclick="editTask(this)"><i class="fa fa-pencil"></i></button>
      <button class="delete-btn" data-index="${index}" onclick="remove(this)"><i class="fa fa-times"></i></button>
    </li>
  `;
}

function showTodos() {
  if (todosJson.length === 0) {
    todosHtml.innerHTML = '';
    emptyImage.style.display = 'block';
  } else {
    todosHtml.innerHTML = todosJson.map(getTodoHtml).join('');
    emptyImage.style.display = 'none';
  }
}

function addTodo(todo)  {
  input.value = "";
  const now = new Date();
  todosJson.unshift({ 
    name: todo, 
    status: "pending", 
    addedAt: now.toLocaleString(), 
    completedAt: null 
  });
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

input.addEventListener("keyup", e => {
  let todo = input.value.trim();
  if (!todo || e.key !== "Enter") {
    return;
  }
  addTodo(todo);
});

addButton.addEventListener("click", () => {
  let todo = input.value.trim();
  if (!todo) {
    return;
  }
  addTodo(todo);
});

function updateStatus(todo) {
  let todoName = todo.parentElement.querySelector('span');
  if (todo.checked) {
    todoName.classList.add("checked");
    todosJson[todo.id].status = "completed";
    todosJson[todo.id].completedAt = new Date().toLocaleString();
  } else {
    todoName.classList.remove("checked");
    todosJson[todo.id].status = "pending";
    todosJson[todo.id].completedAt = null;
  }
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

function editTask(todo) {
  const index = todo.dataset.index;
  const newTask = prompt("Edit your task", todosJson[index].name);
  if (newTask && newTask.trim() !== "") {
    todosJson[index].name = newTask.trim();
    localStorage.setItem("todos", JSON.stringify(todosJson));
    showTodos();
  }
}

function remove(todo) {
  const index = todo.dataset.index;
  todosJson.splice(index, 1);
  showTodos();
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

filters.forEach(function (el) {
  el.addEventListener("click", (e) => {
    filters.forEach(tag => tag.classList.remove('active'));
    el.classList.add('active');
    filter = e.target.dataset.filter;
    showTodos();
  });
});

deleteAllButton.addEventListener("click", () => {
  todosJson = [];
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
});
