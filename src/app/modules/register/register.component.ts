import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  form = {
    name: '',
    lastname: '',
    mail: '',
    password: '',
  };
  confirmPassword = '';

  constructor(private http: HttpClient, private router: Router) { }

  register() {
    if (!this.form.name.trim() || !this.form.lastname.trim() || !this.form.mail.trim() || !this.form.password.trim()) {
      alert('⚠️ Todos los campos son obligatorios');
      return;
    }

    if (!this.form.mail.includes('@') || !this.form.mail.includes('.')) {
      alert('⚠️ Ingrese un correo válido');
      return;
    }

    if (this.form.password.length < 6) {
      alert('⚠️ La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (this.form.password !== this.confirmPassword) {
      alert('⚠️ Las contraseñas no coinciden');
      return;
    }

    this.http.post(`${environment.apiUrl}/auth/register`, this.form).subscribe({
      next: (res: any) => {
        alert('✅ Registro exitoso. Revisa tu correo para verificar tu cuenta.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('❌ Error al registrar:', err);
        alert(err.error.message || '❌ Error al registrar usuario');
      }
    });
  }
  goBack(): void {
    this.router.navigate(['/login']);
  }

  //evento keypress solo letras
  allowOnlyLetters(event: KeyboardEvent) {
    const char = String.fromCharCode(event.keyCode);
    const pattern = /^[a-zA-ZÀ-ÿ\s]+$/;
    if (!pattern.test(char)) {
      event.preventDefault(); // bloquea la tecla
    }
  }
  /// solo numeros
  allowOnlyNumbers(event: KeyboardEvent) {
    const char = String.fromCharCode(event.keyCode);
    if (!/^[0-9]$/.test(char)) {
      event.preventDefault(); // bloquea todo lo que no sea número
    }
  }
}