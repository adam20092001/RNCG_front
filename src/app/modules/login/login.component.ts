import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  showResetModal = false;
  showVerifyModal = false;
  verificacionPendiente = false;
  resetEmail = '';
  newPassword = '';
email: string = '';
password: string = '';
constructor(private http: HttpClient, private router: Router) {}
onSubmit() {
  const body = { email: this.email, password: this.password };

  this.http.post<any>('http://localhost:3000/auth/login', body).subscribe({
    next: (res) => {
      alert('✅ Inicio de sesión exitoso');
      localStorage.setItem('user', JSON.stringify(res.user)); // 👈 Guardamos el usuario

      this.router.navigate(['/home']); // o redirige a donde quieras
    },
    error: (err) => {
      alert(err.error.message || '❌ Error al iniciar sesión');
      // Si es el error de verificación
      const msg = err.error.message
      if (msg.includes('verificar tu correo')) {
        this.showVerifyModal = true;
      }
    }
  });
}

openResetModal() {
  this.showResetModal = true;
}

closeResetModal() {
  this.showResetModal = false;
  this.resetEmail = '';
  this.newPassword = '';
}

resetPassword(): void {
  const body = {
    resetEmail: this.resetEmail,
    newPassword: this.newPassword,
  };

  this.http.post('http://localhost:3000/auth/reset-password', body).subscribe({
    next: () => {
      alert('✅ Contraseña actualizada correctamente');
      this.showResetModal = false;
    },
    error: (err) => {
      console.error('❌ Error:', err);
      alert(err.error.message || '❌ No se pudo restablecer la contraseña.');
    }
  });
}
cerrarModal() {
  this.showVerifyModal = false;
}
reenviarVerificacion() {
  this.http.post('http://localhost:3000/auth/resend-verification', { mail: this.email }).subscribe({
    next: (res: any) => {
      alert(res.message);
      this.showVerifyModal = false;
    },
    error: (err) => {
      alert(err.error.message || '❌ No se pudo reenviar el correo');
    }
  });
}
}
