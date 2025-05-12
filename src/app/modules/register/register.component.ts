import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    if (this.form.password !== this.confirmPassword) {
      alert('⚠️ Las contraseñas no coinciden');
      return;
    }

    this.http.post('http://localhost:3000/auth/register', this.form).subscribe({
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
}