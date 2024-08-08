import './style.css';
import './app.css';

import * as App from '../wailsjs/go/main/App';
import { AddTask, GetTasks, RemoveTask } from '../wailsjs/go/main/App';

document.querySelector('#app').innerHTML = `
<h1 class="todo-title">To-Do List</h1> <!-- Добавлен заголовок -->
    <div class="todo-container">
        <div class="todo-header">
            <input class="input" id="taskInput" type="text" placeholder="Введите задачу..." autocomplete="off" />
            <button class="btn" onclick="addTask()">Добавить</button>
        </div>
        <ul class="todo-list" id="taskList"></ul>
    </div>
`;


let taskInputElement = document.getElementById("taskInput");
taskInputElement.focus();
let taskListElement = document.getElementById("taskList");

// Функция для отображения задач
function renderTasks(tasks) {
    taskListElement.innerHTML = ''; // Очищаем список задач
    tasks.forEach((task, index) => {
        let taskItem = document.createElement('li');
        taskItem.className = 'todo-item';
        taskItem.innerHTML = `
            ${task}
            <button class="btn-remove" onclick="removeTask(${index})">Удалить</button>
        `;
        taskListElement.appendChild(taskItem);
    });
}


window.toggleTaskCompleted = function(index) {
    App.ToggleTaskCompleted(index)
        .then(App.GetTasks)
        .then(renderTasks)
        .catch(err => console.error(err));
};

// Функция для добавления новой задачи
window.addTask = function () {
    let task = taskInputElement.value.trim();
    if (task === "") return;

    App.AddTask(task)
        .then((result) => {
            console.log(result); // Проверяем, что возвращает функция
            return App.GetTasks();
        })
        .then(renderTasks)
        .then(() => {
            taskInputElement.value = '';
            taskInputElement.focus();
        })
        .catch((err) => console.error(err));
};


// Функция для удаления задачи
window.removeTask = function (index) {
    RemoveTask(index)
        .then(GetTasks)
        .then(renderTasks)
        .catch((err) => console.error(err));
};

App.GetTasks()
    .then((tasks) => {
        console.log("Tasks:", tasks); // Проверяем, что возвращает функция
        renderTasks(tasks);
    })
    .catch((err) => console.error(err));
