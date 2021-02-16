const day = document.querySelector('.day');
const date = document.querySelector('.date');
const input = document.querySelector('.input');
const inputBox = document.querySelector('.input-box');
const pendingCount = document.querySelector('.pending-count');
const pendingTodosBox = document.querySelector('.pending-todos-box');
const completedTodosBox = document.querySelector('.completed-todos-box');
const clearButton = document.querySelector('.clear');
const hideButton = document.querySelector('.hide-completed');
const chill = document.querySelector('.chill');
let count = 0;
let todos = [];

day.textContent = new Date().toLocaleDateString('en', { weekday: 'long' });
date.textContent = new Date().toLocaleDateString('en-US').replaceAll('/', '-');

getFromLocalStorage();

inputBox.addEventListener('submit', (event) => {
    event.preventDefault();
    addTodos(input.value);
})

pendingTodosBox.addEventListener('click', (event) => {
    if (event.target.type === 'checkbox') {
        changeCompleted(parseInt(event.target.parentElement.parentElement.getAttribute('data-id')))
    }
    if (event.target.classList.contains('trash')) {
        deleteTodo(parseInt(event.target.parentElement.getAttribute('data-id')));
    }
})
completedTodosBox.addEventListener('click', (event) => {
    if (event.target.classList.contains('trash')) {
        deleteTodo(parseInt(event.target.parentElement.getAttribute('data-id')));
    }
})


clearButton.addEventListener('click', () => {
    clearPendingElements();
})

hideButton.addEventListener('click', () => {
    completedTodosBox.classList.toggle('hide');
    completedTodosBox.classList.contains('hide') ? hideButton.textContent = 'Show Complete' : hideButton.textContent = 'Hide Complete';
})

function getFromLocalStorage() {
    todos = JSON.parse(localStorage.getItem('todos')) || [];
    handleCount(todos);
    createTodosElement(todos);
}

function addToLocalStorage(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
    createTodosElement(todos);
}

function changeCompleted(id) {
    todos.forEach(item => {
        if (item.id == id) {
            item.completed = !item.completed;
        }
    });
    handleCount(todos);
    addToLocalStorage(todos);
}

function deleteTodo(id) {
    todos = todos.filter(item => {
        return item.id !== id;
    })
    handleCount(todos);
    addToLocalStorage(todos);
}

function addTodos(inputdata) {
    if (inputdata !== '') {
        const todo = {
            id: Date.now(),
            name: inputdata,
            completed: false
        }
        todos.push(todo);
        handleCount(todos);
        addToLocalStorage(todos);
        input.value = '';
        pendingTodosBox.firstChild.classList.add('show-in');
    }
}

function createTodosElement(todosArray) {
    pendingTodosBox.innerHTML = '';
    completedTodosBox.innerHTML = '';
    todosArray.forEach(todo => {
        const checked = todo.completed ? 'checked' : null;
        const TodosBoxElement = document.createElement("div");
        TodosBoxElement.classList.add('todo');
        TodosBoxElement.setAttribute('data-id', todo.id);
        if (todo.completed) { TodosBoxElement.classList.add('checked') }
        TodosBoxElement.innerHTML = `
                <div class="input-label-box">
                    <input type="checkbox" ${checked}>
                    <label>${todo.name}</label>
                </div>
                <span class="trash"></span>
         `;
        todo.completed ? completedTodosBox.prepend(TodosBoxElement) : pendingTodosBox.prepend(TodosBoxElement);

    });
    const completedTitle = document.createElement('p');
    completedTitle.textContent = `Completed tasks: ${Math.round((todos.length - count) * 100 / todos.length)}%`
    completedTodosBox.prepend(completedTitle);
}

function handleCount(todos) {
    count = todos.filter(item => item.completed === false).length;
    if (count === 0) {
        timeToChill();
        pendingCount.parentElement.classList.add('hide');
    } else {
        pendingCount.parentElement.classList.remove('hide');
        chill.textContent = '';
        chill.classList.remove('chilldesign');
        pendingCount.textContent = count;
        clearButton.classList.remove('hide');
        hideButton.classList.remove('hide');
    }
}

function clearPendingElements() {
    todos = todos.filter(item => {
        return item.completed === true;
    });
    handleCount(todos);
    addToLocalStorage(todos);
}

function timeToChill() {
    completedTodosBox.classList.add('hide');
    hideButton.textContent = 'Show Complete';
    chill.innerHTML = `<span class="emoji">ide jon az emoji</span>
    Empty!`;
    chill.classList.add('chilldesign');
    clearButton.classList.add('hide');
    hideButton.classList.add('hide');
}