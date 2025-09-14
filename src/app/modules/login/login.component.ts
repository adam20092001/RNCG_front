import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


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
  loading: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;
  constructor(private http: HttpClient, private router: Router) { }
  onSubmit(form?: any) {
    if (form && form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    this.errorMessage = '';
    this.loading = true;
    const body = { email: this.email, password: this.password };

    this.http.post<any>(`${environment.apiUrl}/auth/login`, body).subscribe({
      next: (res) => {
        localStorage.setItem('user', JSON.stringify(res.user));
        this.router.navigate(['/home']);
      },
      error: (err) => {
        const rawMsg = (err?.error?.message || '').toLowerCase();
        if (err?.status === 401 || rawMsg.includes('contraseña') || rawMsg.includes('password')) {
          this.errorMessage = 'Credenciales inválidas. Intente nuevamente.';
        } else {
          this.errorMessage = err?.error?.message || '❌ Error al iniciar sesión';
        }
        if (rawMsg.includes('verificar tu correo')) {
          this.showVerifyModal = true;
        }
        this.loading = false; // stop spinner and re-enable button on error
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  openResetModal() {
    this.showResetModal = true;
  }

  closeResetModal() {
    this.showResetModal = false;
    this.resetEmail = '';
    this.newPassword = '';
  }

/*   resetPassword(): void {
    const body = {
      mail: this.resetEmail,
      newPassword: this.newPassword,
    };

    this.http.post(`${environment.apiUrl}/auth/reset-password`, body).subscribe({
      next: () => {
        alert('✅ Contraseña actualizada correctamente');
        this.showResetModal = false;
      },
      error: (err) => {
        console.error('❌ Error:', err);
        alert(err.error.message || '❌ No se pudo restablecer la contraseña.');
      }
    });
  } */
  cerrarModal() {
    this.showVerifyModal = false;
  }
  reenviarVerificacion() {
    this.http.post(`${environment.apiUrl}/auth/resend-verification`, { mail: this.email }).subscribe({
      next: (res: any) => {
        //alert(res.message);
        this.showVerifyModal = false;
      },
      error: (err) => {
        //alert(err.error.message || '❌ No se pudo reenviar el correo');
      }
    });
  }
  forgotPassword(): void {
    this.http.post(`${environment.apiUrl}/auth/forgot-password`, { mail: this.resetEmail })
      .subscribe({
        next: () => {
          alert('📨 Si el correo está registrado, recibirás un enlace de recuperación.');
          this.showResetModal = false;
        },
        error: (err) => {
          alert(err.error.message || '❌ No se pudo procesar la solicitud.');
        }
      });
  }

}
