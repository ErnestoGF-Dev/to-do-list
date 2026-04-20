import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { User } from '../../types/user-type';   
import { ToDoListService } from '../../service/to-do-list-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  private service = inject(ToDoListService);
  isModeRegister = signal(<boolean>false);
  errorMessage = signal<string | null>(null);

  toggleMode() {
    this.isModeRegister.update(value => !value);
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    const email = emailInput.value.trim();

    let user: User =null as any; 

    if (!email) {
      this.errorMessage.set('Por favor, ingresa un correo electrónico válido.')
      setTimeout(() => this.errorMessage.set(null), 3000);
      return;
    }
    if (this.isModeRegister()) {
      this.service.registerUser(email).subscribe({

        next: (res) => {
        const {id} = res as any;
        user = { id: id, email }; 
        this.authService.login(user);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error al registrar el usuario:', err);
        this.errorMessage.set('Ocurrió un error al registrar el usuario. Por favor, intenta nuevamente.');
        setTimeout(() => this.errorMessage.set(null), 3000);
      }
     });
    }  else {
      this.service.validateUser(email).subscribe({
        next: (res) => {
        const {id} = res as any;
        user = { id: id, email };
        console.log('Usuario validado:', user);
        this.authService.login(user);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error al validar el usuario:', err);
        if (err.status === 404) {
          this.errorMessage.set('Usuario no encontrado. Por favor, regístrate primero.');
          setTimeout(() => this.errorMessage.set(null), 3000);
          return;
        }
        this.errorMessage.set(err.error?.error || 'Ocurrió un error al validar el usuario. Por favor, intenta nuevamente.');
        setTimeout(() => this.errorMessage.set(null), 3000);
      }
     });
    }
  }
}
