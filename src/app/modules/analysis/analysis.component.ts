import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent {
  showModal = false;
  showModalerror = false;
  selectedFile: File | null = null;
  patients: any[] = [];
  selectedPatientId: number | null = null;
  predictionId: number | null = null;
  fileError: string = '';
  //implementaciuon vista previa
  previewUrl: string | null = null;
  imageError = '';
  imageConfirmed = false;
  dragActive = false;


  constructor(private router: Router, private http: HttpClient) { }
  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const userId = user?.id;

    if (!userId) {
      alert('Usuario no identificado. Inicia sesión nuevamente.');
      this.router.navigate(['/login']);
      return;
    }

    this.http.get<any[]>(`${environment.apiUrl}/patients/usere/${userId}`).subscribe({
      next: (data) => {
        this.patients = data;
        console.log(' Pacientes cargados:', data);
      },
      error: (err) => {
        console.error(' Error al cargar pacientes:', err);
      }
    });
  }

  openModal() {
    this.showModal = true;
  }

  openModalerror() {
    this.showModalerror = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedPatientId = null; // Limpiar el ID del paciente al cerrar el modal
    this.selectedFile = null; // Limpiar el archivo seleccionado al cerrar el modal
    window.location.reload();
  }
  closeModalerror() {
    this.showModalerror = false;
    this.selectedPatientId = null; // Limpiar el ID del paciente al cerrar el modal
    this.selectedFile = null; // Limpiar el archivo seleccionado al cerrar el modal
    window.location.reload();
  }

  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;

    if (!this.verificartipodearchivo(file)) {
      this.selectedFile = null;
      this.previewUrl = null;
      this.imageConfirmed = false;
      return;
    }

    this.selectedFile = file;
    this.imageConfirmed = false;

    const reader = new FileReader();
    reader.onload = () => this.previewUrl = reader.result as string;
    reader.readAsDataURL(file);
  }
  verificartipodearchivo(file: File): boolean {
    this.fileError = ''; // limpiar error
    // Validar tipo
    if (!file.type.startsWith('image/')) {
      this.fileError = '⚠️ Formato de archivo no permitido.';
      return false;
    }
    this.fileError = '✅ Formato de archivo Correcto.';
    return true;
  }


  onAnalyze(): void {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const userId = user?.id;

    if (!userId) {
      alert('⚠️ Usuario no identificado. Inicia sesión nuevamente.');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.selectedFile || !this.selectedPatientId) {
      alert('⚠️ Selecciona una imagen y un paciente antes de analizar.');
      return;
    }
    if (!this.verificartipodearchivo(this.selectedFile)) {
      return;
    }
    const formData = new FormData();
    formData.append('image', this.selectedFile);
    formData.append('userId', String(userId));
    formData.append('patientId', String(this.selectedPatientId));

    this.http.post(`${environment.apiUrl}/predict`, formData).subscribe({
      next: (res: any) => {
        console.log('✅ Predicción completada:', res);
        this.openModal(); // Mostrar modal si fue exitoso
        this.predictionId = res.data?.predictionId;
      },
      error: (err) => {
        this.openModalerror(); // Mostrar modal de error
        console.error('❌ Error al predecir:', err);
        //alert('❌ Error al enviar la imagen al backend.');
      }
    });
  }

  confirmAnalysis(): void {
    const paciente = this.selectedPatientId;
    const predictionId = this.predictionId;
    console.log('El paciente a ver es: ', predictionId);
    this.showModal = false;
    this.router.navigate(['/resultados'], { queryParams: { predictionId: predictionId } });
  }
  onDragOver(ev: DragEvent) {
    ev.preventDefault();
    this.dragActive = true;
  }

  onDragLeave(ev: DragEvent) {
    ev.preventDefault();
    this.dragActive = false;
  }

  onDrop(ev: DragEvent) {
    ev.preventDefault();
    this.dragActive = false;

    const file = ev.dataTransfer?.files?.[0];
    if (!file) return;

    // Reusa tu validación existente
    if (!this.verificartipodearchivo(file)) {
      this.selectedFile = null;
      this.previewUrl = null;
      this.imageConfirmed = false;
      return;
    }

    this.selectedFile = file;
    this.imageConfirmed = false; // si cambias la imagen, vuelve a confirmar

    const reader = new FileReader();
    reader.onload = () => (this.previewUrl = reader.result as string);
    reader.readAsDataURL(file);
  }
  confirmImage() { this.imageConfirmed = true; }
  removeImage() {
    this.selectedFile = null;
    this.previewUrl = null;
    this.imageConfirmed = false;
    const inp = document.getElementById('fileInput') as HTMLInputElement | null;
    if (inp) inp.value = '';
  }

}

