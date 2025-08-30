import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  predictions: any[] = [];
  selectedImageUrl: string | null = null;
   selectedImageUrlval: string | null = null;
  modalPrediction: any = null;
  patientList: any[] = [];
  selectedPatientId: string = '';
  environment = environment;

  userId: number | null = null;

  constructor(private http: HttpClient, public route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    this.userId = user?.id;


    if (!this.userId) {
      alert('⚠️ Usuario no identificado. Inicia sesión nuevamente.');
      this.router.navigate(['/login']);
      return;
    }

    this.loadPatients();
    this.fetchPredictions();
    this.loadPredictionsFromRoute();     
  }

  openImageModal(imageUrl: string) {
    this.selectedImageUrl = imageUrl;
  }

  closeImageModal() {
    this.selectedImageUrl = null;
  }

  validatePrediction(id: number, comment: string = '') {

    this.http.patch(`${environment.apiUrl}/predictions/${id}/validate`, { comment }).subscribe({
      next: () => {
        const prediction = this.predictions.find(p => p.id === id);
        if (prediction) {
          prediction.validate = true;
        }
        alert('✅ Predicción validada correctamente');
      },
      error: () => {
        alert('❌ Error al validar la predicción');
      }
    });
  }

  openDetailModal(prediction: any): void {
    this.selectedImageUrlval = prediction.image,
    this.modalPrediction = prediction;
  }

  closeDetailModal(): void {
    this.modalPrediction = null;
    this.selectedImageUrlval = null;
  }

  unvalidatePrediction(id: number): void {
    this.http.patch(`${environment.apiUrl}/predictions/${id}/validate`, { comment: '' }).subscribe({
      next: () => {
        this.modalPrediction = null;
        this.fetchPredictions(); // recargar lista
      },
      error: (err) => {
        console.error('❌ Error al desvalidar predicción:', err);
        alert('❌ No se pudo desvalidar la predicción.');
      }
    });
  }

  fetchPredictions(): void {
    if (!this.userId) return;
    this.http.get<any[]>(`${environment.apiUrl}/predictions/user/${this.userId}`).subscribe({
      next: (data) => {
        this.predictions = data;
      },
      error: (err) => {
        console.error('❌ Error al recargar predicciones:', err);
      }
    });
  }

  loadPatients(): void {
    if (!this.userId) return;
    this.http.get<any[]>(`${environment.apiUrl}/patients/user/${this.userId}`).subscribe({
      next: (data) => {
        this.patientList = data;
      },
      error: (err) => {
        console.error('❌ Error al cargar pacientes:', err);
      }
    });
  }

  filterByPatient(): void {
    if (!this.userId) return;
    if (this.selectedPatientId) {
      this.http.get<any[]>(`${environment.apiUrl}/predictions/user/${this.userId}/patient/${this.selectedPatientId}`).subscribe({
        next: (data) => {
          this.predictions = data;
        },
        error: (err) => {
          console.error('❌ Error al filtrar:', err);
        }
      });
    } else {
      this.fetchPredictions(); // sin filtro
    }
  } 
  verTodos(): void {
    this.selectedPatientId = '';
  
    this.router.navigate(['/resultados']).then(() => {
      this.loadPredictionsFromRoute(); // 👈 recarga lógica explícitamente
    });
  }
    
  loadPredictionsFromRoute(): void {
    this.route.queryParams.subscribe(params => {
      const predictionId = params['predictionId'];
      const patientId = params['patientId'];
  
      if (predictionId) {
        this.http.get<any>(`${environment.apiUrl}/predictions/${predictionId}`).subscribe({
          next: (data) => {
            this.predictions = [data];
            console.log('📥 Predicción individual:', data);
          },
          error: (err) => {
            console.error('❌ Error al cargar predicción única:', err);
            alert('❌ No se pudo cargar la predicción');
          }
        });
      } else {
        let url = `${environment.apiUrl}/predictions/user/${this.userId}`;
        if (patientId) {
          url = `${environment.apiUrl}/predictions/user/${this.userId}/patient/${patientId}`;
          this.selectedPatientId = patientId;
        }
  
        this.http.get<any[]>(url).subscribe({
          next: (data) => {
            this.predictions = data;
            console.log('📥 Predicciones:', data);
          },
          error: (err) => {
            console.error('❌ Error al cargar predicciones:', err);
          }
        });
      }
    });
  }
  
}