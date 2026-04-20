import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { ToDoListService } from '../../service/to-do-list-service';
import { Task, TaskUpdate } from '../../types/tasks-type';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UUID } from 'crypto';

@Component({
  selector: 'app-to-do-list',
  imports: [CommonModule],
  templateUrl: './to-do-list.html',
  styleUrl: './to-do-list.css',
})
export class ToDoList {
  private router = inject(Router);
  route = inject(ActivatedRoute);
  authService = inject(AuthService);
  service = inject(ToDoListService);

  tasks = signal<Task[]>([]);
  isEditing = signal<boolean>(false);
  selectedTaskId = signal<UUID | null>(null);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  showDeleteConfirm = signal<boolean>(false);
  taskIdToDelete = signal<UUID | null>(null);

  constructor() {
    effect(() => {
        const user = this.authService.getUserData();
        if (user) {
           this.loadTasks();
        } else {
            this.tasks.set([]);
        }
    });
  }

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.authService.logout(); 
      return;
    }

    this.resetUrl();
    this.loadTasks();
  }

  resetUrl(){
        this.router.navigate([], {
    queryParams: { 
      id: null        
    },
    queryParamsHandling: 'merge' 
  });
  }

  handleAction(title: string, description: string, status: string, id?: string | number) {
    if(!title.trim() || !description.trim() || !status.trim()){
      this.errorMessage.set('Error: Solicitud incorrecta')
      setTimeout(() => this.errorMessage.set(null), 3000);
      return
    }

    if(id) {
      this.updateTask(id as unknown as UUID, title, description, status);
    }

    this.errorMessage.set(null);
    if(this.isEditing()) {
      this.updateTask(this.selectedTaskId() as UUID, title, description, status);
      this.resetUrl();
      this.isEditing.set(false);
      this.selectedTaskId.set(null);
    } else {
      this.addTask(title, description, status);
    }
  }

  prepareEdit(task: any, titleInput: HTMLInputElement, descInput: HTMLInputElement, statusInput: HTMLSelectElement) {
    // 1. Mandamos el ID a los Query Params
    this.router.navigate([], {
      queryParams: { id: task.id },
      queryParamsHandling: 'merge'
    });

    // 2. Llenamos los inputs con los datos de la tarea
    titleInput.value = task.title;
    descInput.value = task.description;
    statusInput.value = task.status;

    // 3. Activamos modo edición
    this.isEditing.set(true);
    this.selectedTaskId.set(task.id);
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.selectedTaskId.set(null);
    this.router.navigate([], { queryParams: { id: null }, queryParamsHandling: 'merge' });
  }

loadTasks() {
  const email = this.authService.getUserData()?.email || '';
  
  this.service.getTasks(email).subscribe({
    next: (tasks) => {
      const dataArray = Array.isArray(tasks) ? tasks : [];
      this.tasks.set(dataArray);
      this.errorMessage.set(null); // Limpiamos errores previos si la carga es exitosa
    },
    error: (err) => {
      // Aquí capturamos el 404 del middleware de Node
      if (err.status === 404) {
        this.tasks.set([]); 
      } else {
        this.errorMessage.set('Ocurrió un error al cargar las tareas.');
      }
    }
  });
}


  addTask(title: string, description: string, status: string) {
    const taskTitle = title.trim();
    const taskDescription = description.trim();
    const taskStatus = status.trim();

    if (!taskTitle) return;

    const userEmail = this.authService.getUserData()?.email || '';
    this.service.createTask(taskTitle, taskDescription, taskStatus, userEmail).subscribe({
      next: (res) => {
        this.loadTasks();
        title = '';
        description = '';
        status = 'pendiente';
        this.showSuccess('¡Nueva tarea añadida a la lista! 🚀');
      },
      error: (err) => {
        console.error('Error al crear la tarea:', err);
      }
    });
  }

  selectedTask(taskID:string) {
    const currentId = this.route.snapshot.queryParamMap.get('id');
  
  const newId = currentId === taskID ? null : taskID;

  this.router.navigate([], {
    queryParams: { id: newId }, 
    queryParamsHandling: 'merge'
  });
  }

  confirmDelete(id:UUID) {
  this.taskIdToDelete.set(id);
  this.showDeleteConfirm.set(true);
}

  getUsername() {
    const email = this.authService.getUserData()?.email || '';
    return email.split('@')[0] || 'Usuario';
  }

  toggleTarea(id: UUID) {}

executeDelete() {
  const id = this.taskIdToDelete();
  if (id) {
    this.service.deleteTask(id).subscribe({
      next: () => {
        this.showSuccess('Tarea eliminada correctamente');
        this.showDeleteConfirm.set(false);
        this.loadTasks();
      }
    });
  }
}

  updateTask(id: UUID, title: string, description: string, status: string) {
    const task : TaskUpdate = {
      title: title,
      description: description,
      status: status
    };
    this.service.updateTask(id as unknown as number, task).subscribe({
      next: () => {
        this.showSuccess('Tarea actualizada correctamente');
        this.loadTasks();
      },
      error: (err) => {
        console.error('Error al actualizar la tarea:', err);
      }
    });
  }

  showSuccess(msg: string) {
  this.successMessage.set(msg);
  setTimeout(() => this.successMessage.set(null), 3000);
}
}
