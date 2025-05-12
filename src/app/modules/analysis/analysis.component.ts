import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent {
  showModal = false;
  selectedFile: File | null = null;
  patients: any[] = [];
  selectedPatientId: number | null = null;
  predictionId: number | null = null;

  constructor(private router: Router, private http: HttpClient) {}
  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const userId = user?.id;
  
    if (!userId) {
      alert('⚠️ Usuario no identificado. Inicia sesión nuevamente.');
      this.router.navigate(['/login']);
      return;
    }
  
    this.http.get<any[]>(`http://localhost:3000/patients/user/${userId}`).subscribe({
      next: (data) => {
        this.patients = data;
        console.log('📋 Pacientes cargados:', data);
      },
      error: (err) => {
        console.error('❌ Error al cargar pacientes:', err);
      }
    });
  }
  
  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  // 👉 Este método se llama al hacer clic en el botón “Analizar”
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
  
    const formData = new FormData();
    formData.append('image', this.selectedFile);
    formData.append('userId', String(userId));
    formData.append('patientId', String(this.selectedPatientId));
  
    this.http.post('http://localhost:3000/predict', formData).subscribe({
      next: (res:any) => {
        console.log('✅ Predicción completada:', res);
        this.openModal(); // Mostrar modal si fue exitoso
        this.predictionId = res.data?.predictionId;
      },
      error: (err) => {
        console.error('❌ Error al predecir:', err);
        alert('❌ Error al enviar la imagen al backend.');
      }
    });
  }
  
  confirmAnalysis(): void {
    const paciente=this.selectedPatientId;
    const predictionId = this.predictionId;
    console.log('El paciente a ver es: ',predictionId);
    this.showModal = false;
    this.router.navigate(['/resultados'], { queryParams: { predictionId: predictionId } });
  }
}

