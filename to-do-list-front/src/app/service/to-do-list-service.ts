import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Task, TaskUpdate } from '../types/tasks-type';
import { environment } from '../../environments/environment';
import { AuthService } from '../core/auth.service';
import { UUID } from 'crypto';

@Injectable({
  providedIn: 'root',
})
export class ToDoListService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  
  registerUser(email: string) {
    console.log('Registrando usuario con email:', environment.apiUrl, email);
    return this.http.post(`${environment.apiUrl}/createUser`, { email });
  }

  validateUser(email: string) {
    console.log('Validando usuario con email:', environment.apiUrl, email);
    return this.http.post(`${environment.apiUrl}/validateUser`, { email });
  }

  createTask(title: string, description: string, status: string, userEmail: string) {
    const headers = new HttpHeaders({ 'user_id': this.authService.getUserData()?.id || '' });
    return this.http.post(`${environment.apiUrl}/createTask`, { title, description, status, userEmail }, { headers });
  }

  getTasks(correo: string  ) {
    return this.http.get<Task[]>(`${environment.apiUrl}/tasks?email=${correo}`);
  }

  updateTask(id: number, task: TaskUpdate) {
    const headers = new HttpHeaders({ 'user_id': this.authService.getUserData()?.id || '' });
    return this.http.put(`${environment.apiUrl}/updateTask?id=${id}`, task , { headers });
  }

  deleteTask(taskID: UUID) {
    const {id, email} = this.authService.getUserData() || {};
    const header = new HttpHeaders({ 'user_id': id || '' });
    header.append('user_email', email || '');

    return this.http.delete(`${environment.apiUrl}/deleteTask?id=${taskID}`, { headers: header });
  }
}
