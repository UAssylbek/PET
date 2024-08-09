import './style.css';
import './app.css';

import * as App from '../wailsjs/go/main/App';
import { AddTask, GetTasks, RemoveTask } from '../wailsjs/go/main/App';

document.querySelector('#app').innerHTML = `
<h1 class="todo-title">To-Do List</h1>
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
    tasks.forEach((task) => {
        let taskItem = document.createElement('li');
        taskItem.className = 'todo-item';
        taskItem.innerHTML = `
            ${task.task}
            <button class="btn-remove" onclick="removeTask(${task.id})">Удалить</button>
        `;
        taskListElement.appendChild(taskItem);
    });
}

// Функция для добавления новой задачи
window.addTask = function () {
    let task = taskInputElement.value.trim();
    if (task === "") return;

    App.AddTask(task)
        .then(() => App.GetTasks())
        .then(renderTasks)
        .then(() => {
            taskInputElement.value = '';
            taskInputElement.focus();
        })
        .catch((err) => console.error(err));
};

// Функция для удаления задачи
window.removeTask = function (id) {
    App.RemoveTask(id)
        .then(() => App.GetTasks())
        .then(renderTasks)
        .catch((err) => console.error(err));
};

// Получаем и отображаем задачи при загрузке страницы
App.GetTasks()
    .then(renderTasks)
    .catch((err) => console.error(err));
