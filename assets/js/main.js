const todoApp = document.querySelector('#todo-app');
const todoList = document.querySelector('.todo-list');
const todoFilter = document.querySelector('.todos-filter');

function generateUniqueString(length) {
  return Math.random().toString(36).substring(2, 2 + length);
}

function createTodo(todoName) {
  const todoId = generateUniqueString(10);
  const todo = document.createElement('li');
  todo.classList.add('todo-list__item');
  todo.dataset.status = 'active';
  todo.innerHTML = DOMPurify.sanitize(`
    <input type="checkbox" id="${todoId}">
    <label class="todo-checkbox" for="${todoId}"></label>
    <label for="${todoId}" class="todo-name">${todoName}</label>
    <button type="button" class="remove-todo-btn">
      <img src="./assets/images/icon-cross.svg" alt="">
    </button>
  `);

  return todo;
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

  const newTodo = createTodo(todoInputValue);
  todoList.appendChild(newTodo);

  checkUI();
}

function removeTodo(event) {
  const removeTodoBtn = event.target.closest('.remove-todo-btn');
  if (!removeTodoBtn) return;
  
  const todo = removeTodoBtn.parentElement;
  if (confirm('Are you sure?')) {
    todo.remove();
  }

  checkUI();
}

function toggleTodoCompletion(event) {
  const todoCheckbox = event.target.closest('input[type="checkbox"]');
  if (!todoCheckbox) return;
  
  const todo = todoCheckbox.parentElement;
  if (todoCheckbox.checked) {
    todo.dataset.status = 'completed';
  } else {
    todo.dataset.status = 'active';
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
}

function displayActiveTodos(todos) {
  todos.forEach((todo) => todo.style.display = 'none');

  const activeTodos = todos.filter((todo) => todo.getAttribute('data-status') === 'active');
  activeTodos.forEach((activeTodo) => activeTodo.style.display = 'flex');
}

function displayCompletedTodos(todos) {
  todos.forEach((todo) => todo.style.display = 'none');

  const completedTodos = todos.filter((todo) => todo.getAttribute('data-status') === 'completed');
  completedTodos.forEach((completedTodo) => completedTodo.style.display = 'flex');
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

function clearCompletedTodos(event) {
  if (!event.target.closest('.clear-completed-todos')) return;
  const completedTodos = document.querySelectorAll('.todo-list__item[data-status="completed"]');
  if (!completedTodos) return;

  completedTodos.forEach((completedTodo) => completedTodo.remove());
  checkUI();
}

function toggleEmptyTodoState(numberOfTodos) {
  const emptyTodoMessage = document.querySelector('.empty-todo-message');

  if (numberOfTodos === 0) {
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

checkUI();

todoApp.addEventListener('submit', addTodo);
todoList.addEventListener('click', removeTodo);
todoList.addEventListener('click', toggleTodoCompletion);
todoFilter.addEventListener('click', filterTodos);
todoApp.addEventListener('click', clearCompletedTodos);