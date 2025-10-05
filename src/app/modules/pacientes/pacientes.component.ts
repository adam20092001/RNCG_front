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
  deletePatiente: any = null;
  searchText: string = '';
  newPatient = {
    name: '',
    lastname: '',
    age: null,
    sex: '',
    dni: '',
    disable: false
  };
  missingFields: string[] = [];//falta completar campos de paciente al crear


  constructor(private http: HttpClient, private router: Router) { }

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
        this.patients = (data || []).filter(p => !p.disable);
      },
      error: err => {
        console.error('❌ Error al cargar pacientes:', err);
      }
    });
  }

  get filteredPatients() {
    const text = this.normalizeText(this.searchText);
    if (!text) return this.patients;
    return this.patients.filter(p => {
      const name = this.normalizeText(p.name);
      const lastname = this.normalizeText(p.lastname);
      const dni = this.normalizeText(p.dni);
      return name.includes(text) || lastname.includes(text) || dni.includes(text);
    });
  }

  private normalizeText(value: any): string {
    return (value || '')
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  deletePatient(patiente: any) {
    this.deletePatiente = patiente;
    this.deletePatiente.disable = true;
    if (confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
      this.http.put(`${environment.apiUrl}/patients/${this.deletePatiente.id}`, this.deletePatiente).subscribe({
        next: () => {
          this.loadPatients();
        },
        error: err => {
          console.error('❌ Error al eliminar paciente:', err);
        }

      });
    }
    // this.deletePatiente=null;
  }

  openModal(): void {
    this.showModal = true;
  }
  closeModal(): void {
    this.showModal = false;
    this.newPatient = { name: '', lastname: '', age: null, sex: '', dni: '', disable: false };
    this.missingFields = [];
  }
  createPatient(form?: any) {
    this.missingFields = [];
    const user = JSON.parse(localStorage.getItem('user')!);
    const userId = user?.id;

    if (!userId) {
      alert('⚠️ Usuario no identificado.');
      return;
    }

    this.newPatient.disable = false;

    if (form && form.invalid) {
      if (!this.newPatient.name) this.missingFields.push('Nombre');
      if (!this.newPatient.lastname) this.missingFields.push('Apellido');
      if (!this.newPatient.age) this.missingFields.push('Edad');
      if (!this.newPatient.sex) this.missingFields.push('Sexo');
      if (!this.newPatient.dni) this.missingFields.push('DNI');
      return; // no enviar si faltan campos
    }
    if (this.newPatient.dni.length != 8) {
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
    this.missingFields = [];
  }

  updatePatient() {
    this.missingFields = [];
    if (!this.editPatient.name) this.missingFields.push('Nombre');
    if (!this.editPatient.lastname) this.missingFields.push('Apellido');
    if (!this.editPatient.age) this.missingFields.push('Edad');
    if (!this.editPatient.sex) this.missingFields.push('Sexo');
    if (!this.editPatient.dni) this.missingFields.push('DNI');
    // Si hay faltantes, no enviar
    if (this.missingFields.length > 0) {
      return;
    }
    if ((this.editPatient?.dni?.toString()?.length || 0) > 0 && this.editPatient?.dni?.toString()?.length !== 8) {
      return;
      console.log('DNI debe tener 8 caracteres');
    }
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
