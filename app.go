package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

// Task представляет задачу с текстом, ID и статусом выполнения
type Task struct {
	ID        int    `json:"id"`
	Task      string `json:"task"`
	Completed bool   `json:"completed"`
}

// App struct
type App struct {
	ctx context.Context
	db  *sql.DB
}

// NewApp создает новое приложение App
func NewApp() *App {
	// Открываем подключение к базе данных
	db, err := sql.Open("sqlite3", "./tasks.db")
	if err != nil {
		log.Fatal(err)
	}

	// Создаем таблицу, если ее нет
	sqlStmt := `CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT, completed BOOLEAN DEFAULT 0);`
	_, err = db.Exec(sqlStmt)
	if err != nil {
		log.Fatal(err)
	}

	return &App{db: db}
}

// startup вызывается при старте приложения
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet возвращает приветствие для указанного имени
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// AddTask добавляет задачу в базу данных
func (a *App) AddTask(task string) {
	_, err := a.db.Exec("INSERT INTO tasks(task) VALUES(?)", task)
	if err != nil {
		log.Println("Ошибка при добавлении задачи:", err)
	}
}

// GetTasks возвращает все задачи из базы данных
func (a *App) GetTasks() []Task {
	rows, err := a.db.Query("SELECT id, task, completed FROM tasks")
	if err != nil {
		log.Println("Ошибка при получении задач:", err)
		return nil
	}
	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		var task Task
		if err := rows.Scan(&task.ID, &task.Task, &task.Completed); err != nil {
			log.Println("Ошибка при чтении задачи:", err)
		}
		tasks = append(tasks, task)
	}
	return tasks
}

// RemoveTask удаляет задачу по ее ID из базы данных
func (a *App) RemoveTask(id int) {
	_, err := a.db.Exec("DELETE FROM tasks WHERE id = ?", id)
	if err != nil {
		log.Println("Ошибка при удалении задачи:", err)
	}
}

// ToggleTaskCompleted переключает статус выполнения задачи
func (a *App) ToggleTaskCompleted(id int) {
	_, err := a.db.Exec("UPDATE tasks SET completed = NOT completed WHERE id = ?", id)
	if err != nil {
		log.Println("Ошибка при изменении статуса задачи:", err)
	}
}

// Startup вызывается при старте приложения
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}
