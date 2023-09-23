const todoApp = document.querySelector('#todo-app');
const todoList = document.querySelector('.todo-list');

function generateUniqueString(length) {
  return Math.random().toString(36).substring(2, 2 + length);
}

function createTodo(todoName) {
  const todoId = generateUniqueString(10);
  const todo = document.createElement('li');
  todo.classList.add('todo-list__item');
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
}

function removeTodo(event) {
  const removeTodoBtn = event.target.closest('.remove-todo-btn');
  if (!removeTodoBtn) return;
  
  const todo = removeTodoBtn.parentElement;
  if (confirm('Are you sure?')) {
    todo.remove();
  }
}

function toggleTodoCompletion(event) {
  const todoCheckbox = event.target.closest('input[type="checkbox"]');
  if (!todoCheckbox) return;
  
  const todo = todoCheckbox.parentElement;
  if (todoCheckbox.checked) {
    todo.dataset.completed = true;
  } else {
    todo.dataset.completed = false;
  }
}

todoApp.addEventListener('submit', addTodo);
todoList.addEventListener('click', removeTodo);
todoList.addEventListener('click', toggleTodoCompletion);