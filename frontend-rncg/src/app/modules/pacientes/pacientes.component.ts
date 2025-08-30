import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-patients',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss']
})
export class PacientesComponent implements OnInit {
  patients: any[] = [];
  showModal = false;
  showEditModal = false;
  editPatient: any = null;
  newPatient = {
    name: '',
    lastname: '',
    age: null,
    sex: '',
    dni: ''
  };
  

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients() {
    const user = JSON.parse(localStorage.getItem('user')!);
    const userId = user?.id;
    if (!userId) {
      alert('⚠️ Usuario no identificado. Inicia sesión nuevamente.');
      this.router.navigate(['/login']);
      return;
    }
    this.http.get<any[]>(`${environment.apiUrl}/patients/user/${userId}`).subscribe({
    next: data => {
      this.patients = data;
      console.log('📥 Pacientes cargados solo del usuario:', data);
    },
    error: err => {
      console.error('❌ Error al cargar pacientes:', err);
    }
  });
  }

  deletePatient(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
      this.http.delete(`${environment.apiUrl}/patients/${id}`).subscribe({
        next: () => {
          this.loadPatients();
        },
        error: err => {
          console.error('❌ Error al eliminar paciente:', err);
        }
      });
    }
  }

  openModal(): void {
    this.showModal = true;
  }
  closeModal(): void {
    this.showModal = false;
    this.newPatient = { name: '', lastname: '', age: null, sex: '', dni: '' };
  }
  createPatient(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    const userId = user?.id;
  
    if (!userId) {
      alert('⚠️ Usuario no identificado.');
      return;
    }
  
    this.http.post(`${environment.apiUrl}/patients`, { ...this.newPatient, user: { id: userId } }).subscribe({
      next: () => {
        //alert('✅ Paciente registrado correctamente');
        this.closeModal();
        this.loadPatients(); // recarga la tabla
      },
      error: (err) => {
        console.error('❌ Error al registrar paciente:', err);
        alert('❌ Ocurrió un error al guardar');
      }
    });
  }
  
  openEditModal(patient: any) {
    this.editPatient = { ...patient }; // copia los datos del paciente
    this.showEditModal = true;
  }
  
  closeEditModal() {
    this.showEditModal = false;
    this.editPatient = null;
  }
  
  updatePatient() {
    this.http.put(`${environment.apiUrl}/patients/${this.editPatient.id}`, this.editPatient).subscribe({
      next: () => {
        //alert('✅ Paciente actualizado correctamente');
        this.closeEditModal();
        this.loadPatients(); // recargar lista
      },
      error: (err) => {
        console.error('❌ Error al actualizar paciente:', err);
        alert('❌ No se pudo actualizar el paciente');
      }
    });
  }
  verResultados(patientId: number) {
    this.router.navigate(['/resultados'], { queryParams: { patientId } });
  }
}
