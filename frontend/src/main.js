import './style.css';
import './app.css';

import * as App from '../wailsjs/go/main/App';
import { AddTask, GetTasks, RemoveTask, ToggleTaskCompleted } from '../wailsjs/go/main/App';

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

// Функция для отображения модального окна с ошибкой
function showErrorModal(message) {
    document.getElementById('errorMessage').innerText = message;
    document.getElementById('errorModal').style.display = 'block';
}

// Функция для закрытия модального окна
function closeErrorModal() {
    document.getElementById('errorModal').style.display = 'none';
}

window.closeErrorModal = closeErrorModal;

// Закрытие модального окна при клике вне его области
window.onclick = function(event) {
    if (event.target === document.getElementById('errorModal')) {
        closeErrorModal();
    }
}


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
            <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTaskCompleted(${task.id})">
            <span class="${task.completed ? 'completed' : ''}">${task.task}</span>
            <button class="btn-remove" onclick="removeTask(${task.id})">Удалить</button>
        `;
        // Добавляем задачи в начало списка
        taskListElement.insertBefore(taskItem, taskListElement.firstChild);
    });
}
window.removeTask = function (taskId) {
    removeTaskWithConfirmation(taskId);
};
// Функция для добавления новой задачи
window.addTask = function () {
    let task = taskInputElement.value.trim(); // Удаляем лишние пробелы

    // Валидация: проверка на пустой ввод
    if (task === "") {
        showErrorModal("Невозможно добавить пустую задачу."); // Показываем модальное окно с ошибкой
        return; // Не добавляем пустую задачу
    }

    // Добавляем задачу
    App.AddTask(task)
        .then(() => App.GetTasks())
        .then(renderTasks)
        .then(() => {
            taskInputElement.value = ''; // Очищаем поле ввода
            taskInputElement.focus();    // Фокусируемся на поле ввода
        })
        .catch((err) => {
            console.error(err);
            showErrorModal("Произошла ошибка при добавлении задачи."); // Показываем модальное окно с ошибкой
        });
};


export function removeTaskWithConfirmation(taskId) {
    showConfirmModal("Вы уверены, что хотите удалить эту задачу?", () => {
        // Замените `App.RemoveTask` на вашу функцию удаления
        App.RemoveTask(taskId)
            .then(() => App.GetTasks())
            .then(renderTasks)
    });
}

// Функция для переключения состояния выполнения задачи
window.toggleTaskCompleted = function (id) {
    App.ToggleTaskCompleted(id)
        .then(() => App.GetTasks())
        .then(renderTasks)
        .catch((err) => console.error(err));
};

// Получаем и отображаем задачи при загрузке страницы
App.GetTasks()
    .then(renderTasks)
    .catch((err) => console.error(err));


// Функция для отображения модального окна подтверждения
export function showConfirmModal(message, confirmCallback) {
    document.getElementById('confirmMessage').innerText = message;
    document.getElementById('confirmButton').onclick = () => {
        confirmCallback();
        closeConfirmModal();
    };
    document.getElementById('cancelButton').onclick = closeConfirmModal;
    document.getElementById('confirmModal').style.display = 'block';
}

// Функция для закрытия модального окна подтверждения
export function closeConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
}
window.closeConfirmModal = closeConfirmModal;

// Обработчики событий для кнопок
document.addEventListener('DOMContentLoaded', () => {
    const closeErrorButton = document.querySelector('#errorModal .close');
    if (closeErrorButton) {
        closeErrorButton.addEventListener('click', closeErrorModal);
    }

    const closeConfirmButton = document.querySelector('#confirmModal .close');
    if (closeConfirmButton) {
        closeConfirmButton.addEventListener('click', closeConfirmModal);
    }
});
