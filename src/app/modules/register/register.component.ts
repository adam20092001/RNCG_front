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
      next: () => {
        alert('✅ Registro exitoso');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('❌ Error al registrar:', err);
        alert('❌ Error al registrar usuario');
      }
    });
  }
}
