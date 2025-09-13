import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  resetPassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    const body = { token: this.token, newPassword: this.newPassword };

    this.http.post(`${environment.apiUrl}/auth/reset-password`, body).subscribe({
      next: () => {
        alert('✅ Contraseña actualizada correctamente');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error.message || '❌ El enlace no es válido o ha expirado.';
      }
    });
  }
}
