const todoApp = document.querySelector('#todo-app');
const todoList = document.querySelector('.todo-list');
const todoFilter = document.querySelector('.todos-filter');

const todos = JSON.parse(getItemsFromLocalStorage()) || [];

function getItemsFromLocalStorage() {
  const itemsFromLocalStorage = localStorage.getItem('todos');
  return itemsFromLocalStorage;
}

function updateTodosInLocalStorage() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function displayTodos() {
  todos.forEach((todo) => addTodoToDOM(todo.name, todo.id, todo.status));
  checkUI();
}

function generateUniqueString(length) {
  return Math.random().toString(36).substring(2, 2 + length);
}

function createTodo(todoName, todoId, todoStatus) {
  const todo = document.createElement('li');
  todo.classList.add('todo-list__item');
  todo.dataset.id = todoId;
  todo.dataset.status = todoStatus;
  todo.innerHTML = DOMPurify.sanitize(`
    <input type="checkbox" id="${todoId}" ${todoStatus === 'completed' && 'checked'}>
    <label class="todo-checkbox" for="${todoId}"></label>
    <label for="${todoId}" class="todo-name">${todoName}</label>
    <button type="button" class="remove-todo-btn">
      <img src="./assets/images/icon-cross.svg" alt="">
    </button>
  `);

  return todo;
}

function addTodoToDOM(todoName, todoId, todoStatus) {
  const newTodo = createTodo(todoName, todoId, todoStatus);
  todoList.appendChild(newTodo);
}

function addTodo(event) {
  event.preventDefault();

  const todoInput = document.querySelector('#todo-input');
  const todoInputValue = todoInput.value.trim();

  todoInput.value = '';

  if (todoInputValue === '') {
    alert('Please enter a todo');
    return;
  }

  const newTodo = {
    name: todoInputValue,
    id: generateUniqueString(10),
    status: 'active',
  }
  todos.push(newTodo);
  updateTodosInLocalStorage();

  addTodoToDOM(newTodo.name, newTodo.id, newTodo.status);

  checkUI();
}

function removeTodoFromTodosState(todoId) {
  const todoIndex = todos.findIndex((todo) => todo.id === todoId);
  todos.splice(todoIndex, 1);
}

function removeTodo(event) {
  const removeTodoBtn = event.target.closest('.remove-todo-btn');
  if (!removeTodoBtn) return;
  
  const todo = removeTodoBtn.parentElement;
  const todoId = todo.dataset.id;
  if (confirm('Are you sure?')) {
    todo.remove();
    removeTodoFromTodosState(todoId);
    updateTodosInLocalStorage();
  }

  checkUI();
}

function changeTodoStatusInTodosState(todoId, todoStatus) {
  const todoIndex = todos.findIndex((todo) => todo.id === todoId);
  todos[todoIndex].status = todoStatus;
}

function changeTodoStatus(event) {
  const todoCheckbox = event.target.closest('input[type="checkbox"]');
  if (!todoCheckbox) return;
  
  const todo = todoCheckbox.parentElement;
  const todoId = todo.dataset.id;
  if (todoCheckbox.checked) {
    todo.dataset.status = 'completed';
    changeTodoStatusInTodosState(todoId, 'completed');
    updateTodosInLocalStorage();
  } else {
    todo.dataset.status = 'active';
    changeTodoStatusInTodosState(todoId, 'active');
    updateTodosInLocalStorage();
  }
}

function highlightAllTodoTabBtn() {
  const todoTabBtns = [...document.querySelectorAll('[data-toggle]')];
  todoTabBtns.forEach((todoTabBtn) => todoTabBtn.setAttribute('aria-selected', false));
  
  const allTodoTabBtn = document.querySelector('[data-toggle="all"]');
  allTodoTabBtn.setAttribute('aria-selected', true);
}

function highlightActiveTodoTabBtn() {
  const todoTabBtns = [...document.querySelectorAll('[data-toggle]')];
  todoTabBtns.forEach((todoTabBtn) => todoTabBtn.setAttribute('aria-selected', false));
  
  const activeTodoTabBtn = document.querySelector('[data-toggle="active"]');
  activeTodoTabBtn.setAttribute('aria-selected', true);
}

function highlightCompletedTodoTabBtn() {
  const todoTabBtns = [...document.querySelectorAll('[data-toggle]')];
  todoTabBtns.forEach((todoTabBtn) => todoTabBtn.setAttribute('aria-selected', false));
  
  const completedTodoTabBtn = document.querySelector('[data-toggle="completed"]');
  completedTodoTabBtn.setAttribute('aria-selected', true);
}

function displayAllTodos(todos) {
  todos.forEach((todo) => todo.style.display = 'flex');

  checkUI();
}

function displayActiveTodos(todos) {
  todos.forEach((todo) => todo.style.display = 'none');

  const activeTodos = todos.filter((todo) => todo.getAttribute('data-status') === 'active');
  activeTodos.forEach((activeTodo) => activeTodo.style.display = 'flex');

  const emptyTodoMessage = document.querySelector('.empty-todo-message');
  if (activeTodos.length === 0) {
    emptyTodoMessage.textContent = 'There are no active todos';
    emptyTodoMessage.style.display = 'block';
  } else {
    emptyTodoMessage.style.display = 'none';
  }
}

function displayCompletedTodos(todos) {
  todos.forEach((todo) => todo.style.display = 'none');

  const completedTodos = todos.filter((todo) => todo.getAttribute('data-status') === 'completed');
  completedTodos.forEach((completedTodo) => completedTodo.style.display = 'flex');

  const emptyTodoMessage = document.querySelector('.empty-todo-message');
  if (completedTodos.length === 0) {
    emptyTodoMessage.textContent = 'There are no completed todos';
    emptyTodoMessage.style.display = 'block';
  } else {
    emptyTodoMessage.style.display = 'none';
  }
}

function filterTodos(event) {
  const todos = [...document.querySelectorAll('.todo-list__item')];
  if (event.target.closest('[data-toggle="all"]')) {
    highlightAllTodoTabBtn();
    displayAllTodos(todos);
  } else if (event.target.closest('[data-toggle="active"]')) {
    highlightActiveTodoTabBtn();
    displayActiveTodos(todos);
  } else if (event.target.closest('[data-toggle="completed"]')) {
    highlightCompletedTodoTabBtn();
    displayCompletedTodos(todos);
  }
}

function clearCompletedTodosFromTodosState(completedTodos) {
  completedTodos.forEach((completedTodo) => {
    const completedTodoId = completedTodo.dataset.id;
    const completedTodoIndex = todos.findIndex((todo) => todo.id === completedTodoId);
    todos.splice(completedTodoIndex, 1);
  });
}

function clearCompletedTodos(event) {
  if (!event.target.closest('.clear-completed-todos')) return;
  const completedTodos = document.querySelectorAll('.todo-list__item[data-status="completed"]');
  if (!completedTodos) return;

  completedTodos.forEach((completedTodo) => completedTodo.remove());
  clearCompletedTodosFromTodosState(completedTodos);
  updateTodosInLocalStorage();
  checkUI();
}

function toggleEmptyTodoState(numberOfTodos) {
  const emptyTodoMessage = document.querySelector('.empty-todo-message');

  if (numberOfTodos === 0) {
    emptyTodoMessage.textContent = 'Your todo list is empty. Hurray! 🎉';
    emptyTodoMessage.style.display = 'block';
  } else {
    emptyTodoMessage.style.display = 'none';
  }
}

function displayNumberOfTodos(numberOfTodos) {
  const numberOfTodosEl = document.querySelectorAll('.active-todos');

  numberOfTodosEl.forEach((element) => {
    const elementTextContent = numberOfTodos > 1 ? `${numberOfTodos} Items Left` : `${numberOfTodos} Item Left`;
    element.textContent = elementTextContent;
  });
}

function checkUI() {
  const todos = document.querySelectorAll('.todo-list__item');
  const numberOfTodos = todos.length;

  toggleEmptyTodoState(numberOfTodos);
  displayNumberOfTodos(numberOfTodos);
}

displayTodos();

todoApp.addEventListener('submit', addTodo);
todoList.addEventListener('click', removeTodo);
todoList.addEventListener('click', changeTodoStatus);
todoFilter.addEventListener('click', filterTodos);
todoApp.addEventListener('click', clearCompletedTodos);