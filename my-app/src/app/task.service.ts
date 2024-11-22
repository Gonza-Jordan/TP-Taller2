import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:4000/api/tasks'; // Asegúrate de que coincida con la configuración del backend

  constructor(private http: HttpClient) {}

  // Obtener todas las tareas
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      map((tasks: any[]) =>
        tasks.map((task) => ({
          id: task._id, // Mapea _id a id
          title: task.title,
          description: task.description,
          completed: task.completed,
        }))
      )
    );
  }
  // Crear una nueva tarea
  createTask(task: Partial<Task>): Observable<Task> {
    console.log('createTask');
    console.log(task);
    return this.http.post<Task>(this.apiUrl, task);
  }

  // Actualizar una tarea
  updateTask(id: string, updatedTask: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, updatedTask);
  }

  // Eliminar una tarea
  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
