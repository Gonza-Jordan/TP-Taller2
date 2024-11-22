import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule  } from '@angular/router';
import { TaskService, Task } from './task.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule ], // Agrega los módulos aquí
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Lista de tareas';
  formNewTask: FormGroup;
  tasksList: Task[] = [];
  editingTaskIndex: number | null = null;

  constructor(
    private router: RouterModule ,
    private formBuilder: FormBuilder,
    private taskService: TaskService
  ) {
    this.formNewTask = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  // Cargar tareas desde el backend
  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => (this.tasksList = tasks),
      error: (err) => console.error('Error al cargar tareas:', err),
    });
  }

  // Agregar o actualizar una tarea
  onSubmit(): void {
    const task = {
      title: this.formNewTask.value.title,
      description: this.formNewTask.value.description,
      completed: false,
    };

    if (this.editingTaskIndex !== null) {
      // Actualizar tarea existente
      const existingTask = this.tasksList[this.editingTaskIndex];
      this.taskService.updateTask(existingTask.id, task).subscribe({
        next: (updatedTask) => {
          this.tasksList[this.editingTaskIndex!] = updatedTask;
          this.editingTaskIndex = null;
        },
        error: (err) => console.error('Error al actualizar la tarea:', err),
      });
    } else {
      // Crear nueva tarea
      this.taskService.createTask(task).subscribe({
        next: (newTask) => this.tasksList.push(newTask),
        error: (err) => console.error('Error al crear la tarea:', err),
      });
    }

    this.formNewTask.reset();
  }

  // Iniciar la edición de una tarea
  editTask(index: number): void {
    this.editingTaskIndex = index;
    const task = this.tasksList[index];
    this.formNewTask.setValue({
      title: task.title,
      description: task.description,
    });
  }

  // Cancelar la edición de una tarea
  cancelEdit(): void {
    this.editingTaskIndex = null;
    this.formNewTask.reset();
  }

  // Eliminar una tarea
  deleteTask(index: number): void {
    const taskId = this.tasksList[index].id;
    this.taskService.deleteTask(taskId).subscribe({
      next: () => this.tasksList.splice(index, 1),
      error: (err) => console.error('Error al eliminar la tarea:', err),
    });
  }

  // Marcar una tarea como completada o no completada
  toggleCompletion(index: number): void {
    const task = this.tasksList[index];
    task.completed = !task.completed; // Cambiar el estado de completado
  
    this.taskService.updateTask(task.id, task).subscribe({
      next: (updatedTask) => {
        this.tasksList[index] = updatedTask; // Actualizar la lista local con la respuesta del backend
      },
      error: (err) => console.error('Error al actualizar el estado de la tarea:', err),
    });
  }

}