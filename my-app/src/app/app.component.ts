import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TaskService, Task } from './task.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // Módulos necesarios
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Lista de tareas';
  formNewTask: FormGroup; // Formulario para crear/editar tareas
  tasksList: Task[] = []; // Lista de tareas cargadas desde el backend
  editingTaskIndex: number | null = null; // Índice de la tarea que está siendo editada

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService // Servicio para interactuar con el backend
  ) {
    // Inicialización del formulario con validaciones
    this.formNewTask = this.formBuilder.group({
      title: new FormControl('', Validators.required), // Campo obligatorio
      description: new FormControl('', Validators.required), // Campo obligatorio
    });
  }

  // Se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.loadTasks(); // Cargar las tareas al iniciar
  }

  // Cargar tareas desde el backend
  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        console.log('Tareas obtenidas del servidor:', tasks); // Depuración
        this.tasksList = tasks; // Actualizar la lista de tareas
      },
      error: (err) => console.error('Error al cargar tareas:', err),
    });
  }

  // Método para agregar o actualizar una tarea
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
        next: () => {
          this.loadTasks(); // Recargar la lista de tareas desde el backend
        },
        error: (err) => console.error('Error al crear la tarea:', err),
      });
    }
  
    this.formNewTask.reset(); // Limpiar el formulario después de enviar
  } 

  // Iniciar la edición de una tarea
  editTask(index: number): void {
    this.editingTaskIndex = index; // Establecer el índice de la tarea en edición
    const task = this.tasksList[index];
    this.formNewTask.setValue({
      title: task.title, // Llenar el formulario con los datos de la tarea
      description: task.description,
    });
  }

  // Cancelar la edición de una tarea
  cancelEdit(): void {
    this.editingTaskIndex = null; // Salir del modo edición
    this.formNewTask.reset(); // Limpiar el formulario
  }

  // Eliminar una tarea
  deleteTask(index: number): void {
    const taskId = this.tasksList[index].id; // Obtener el ID de la tarea
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasksList.splice(index, 1); // Eliminar la tarea de la lista local
      },
      error: (err) => console.error('Error al eliminar la tarea:', err),
    });
  }

  // Marcar una tarea como completada o no completada
  toggleCompletion(index: number): void {
    const task = this.tasksList[index];
    task.completed = !task.completed; // Cambiar el estado de completado
    this.taskService.updateTask(task.id, task).subscribe({
      error: (err) => console.error('Error al actualizar el estado de la tarea:', err),
    });
  }
}
