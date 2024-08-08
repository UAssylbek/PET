package main

import (
	"context"
	"fmt"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// Задачи сохраняются в слайсе
var tasks []string

// AddTask добавляет задачу
func (a *App) AddTask(task string) {
	tasks = append(tasks, task)
}

// GetTasks возвращает все задачи
func (a *App) GetTasks() []string {
	return tasks
}

// RemoveTask удаляет задачу по индексу
func (a *App) RemoveTask(index int) {
	if index >= 0 && index < len(tasks) {
		tasks = append(tasks[:index], tasks[index+1:]...)
	}
}

// Startup вызывается при старте приложения
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}
