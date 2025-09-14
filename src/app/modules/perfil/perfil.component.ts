import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  user: any = null;
  showResetModal = false;
  resetEmail = '';
  newPassword = '';
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      alert('⚠️ Debes iniciar sesión');
      this.router.navigate(['/login']);
      return;
    }
    const parsed = JSON.parse(storedUser);
    const userId = parsed.id;
    this.resetEmail = parsed.email;
  
    this.http.get(`${environment.apiUrl}/users/${userId}`).subscribe({
      next: (data) => {
        this.user = data;
      },
      error: () => {
        alert('❌ No se pudo cargar la información del perfil');
      }
    });
  }
  

  updateProfile(): void {
    this.http.put(`${environment.apiUrl}/users/${this.user.id}`, this.user).subscribe({
      next: () => {
        alert('✅ Perfil actualizado correctamente');
        localStorage.setItem('user', JSON.stringify(this.user)); // Actualiza el localStorage
      },
      error: (err) => {
        console.error('❌ Error al actualizar perfil:', err);
        alert('❌ No se pudo actualizar el perfil');
      }
    });
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
  openResetModal() {
  this.showResetModal = true;
  }
  closeResetModal() {
  this.showResetModal = false;
  }
  resetPassword(): void {
  console.log(this.resetEmail);
  this.http.post(`${environment.apiUrl}/auth/forgot-password`, { mail: this.resetEmail }).subscribe({
    next: () => {
      alert('📨 Si el correo está registrado, recibirás un enlace de recuperación.');
      this.showResetModal = false;
    },
    error: (err) => {
      alert(err.error.message || '❌ No se pudo procesar la solicitud.');
    }
  });
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
