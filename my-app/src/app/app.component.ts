import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TaskService } from './task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  title = 'Lista de tareas';
  formNewTask: FormGroup;
  tasksList: any[] = [];
  editingTaskIndex: number | null = null;

  constructor(
              protected router: Router, 
              private formBuilder: FormBuilder, 
              private taskService: TaskService
              ) {
    this.formNewTask = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {}

  // Método para agregar una nueva tarea o actualizar una existente
  onSubmit() {
    const task = {
      title: this.formNewTask.value.title,
      description: this.formNewTask.value.description,
      isCompleted: false
    };
    
    console.log('onsubmit');
    
    if (this.editingTaskIndex !== null) {
      this.tasksList[this.editingTaskIndex] = task;
      this.editingTaskIndex = null;
    } else {
      this.taskService.createTask(task).subscribe({
        next: (newTask) => {
          console.log('Tarea creada con éxito:', newTask);
          this.tasksList.push(task);
        },
        error: (err) => {
          console.error('Error al crear la tarea:', err);
        },
        complete: () => {
          console.log('Creación de tarea completada.');
        }
      });

          // this.tasksList.push(task);
    }

    this.formNewTask.reset();
  }

  // Método para iniciar la edición de una tarea
  editTask(index: number) {
    this.editingTaskIndex = index;
    const task = this.tasksList[index];
    this.formNewTask.setValue({
      title: task.title,
      description: task.description
    });
  }

  // Método para cancelar la edición de una tarea
  cancelEdit() {
    this.editingTaskIndex = null;
    this.formNewTask.reset();
  }

  // Método para eliminar una tarea
  deleteTask(index: number) {
    this.tasksList.splice(index, 1);
    if (this.editingTaskIndex === index) {
      this.editingTaskIndex = null;
    }
  }

  // Método para marcar una tarea como completada o no completada
  toggleCompletion(index: number) {
    this.tasksList[index].isCompleted = !this.tasksList[index].isCompleted;
  }
}
