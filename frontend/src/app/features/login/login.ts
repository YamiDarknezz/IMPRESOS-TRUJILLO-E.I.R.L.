import { Component, inject } from '@angular/core';
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

  async onLogin(): Promise<void> {
    if (!this.email || !this.password) {
      this.errorMessage = 'Ingresa tu correo y contraseña.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    try {
      await this.authService.login(this.email.trim(), this.password);
      this.router.navigate(['/ordenes']);
    } catch (error) {
      this.errorMessage = mensajeDeError(error, 'No se pudo iniciar sesión.');
    } finally {
      this.loading = false;
    }
  }
}
