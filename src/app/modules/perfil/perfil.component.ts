import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  user: any = null;

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
  
    this.http.get(`http://localhost:3000/users/${userId}`).subscribe({
      next: (data) => {
        this.user = data;
      },
      error: () => {
        alert('❌ No se pudo cargar la información del perfil');
      }
    });
  }
  

  updateProfile(): void {
    this.http.put(`http://localhost:3000/users/${this.user.id}`, this.user).subscribe({
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
}
