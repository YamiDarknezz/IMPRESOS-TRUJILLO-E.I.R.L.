import { Component, inject, signal } from '@angular/core'; // Agregamos 'signal'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { mensajeDeError } from '../../shared/utilidades/errores';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  // NUEVO: estado para controlar el temblor
  readonly shake = signal(false);

  async onLogin(): Promise<void> {
    if (!this.email || !this.password) {
      this.errorMessage = 'Ingresa tu correo y contraseña.';
      this.triggerShake(); // Llamamos al temblor
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    try {
      await this.authService.login(this.email.trim(), this.password);
      this.router.navigate(['/ordenes']);
    } catch (error) {
      this.errorMessage = mensajeDeError(error, 'No se pudo iniciar sesión.');
      this.triggerShake(); // Llamamos al temblor
    } finally {
      this.loading = false;
    }
  }

  // NUEVO: método que hace temblar la tarjeta y lo reinicia
  triggerShake(): void {
    this.shake.set(false);
    setTimeout(() => this.shake.set(true), 10);
    setTimeout(() => this.shake.set(false), 420);
  }
}