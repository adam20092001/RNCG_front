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
  tempSearchText: string = '';
  searchText: string = '';
  selectedImageUrl: string | null = null;
   selectedImageUrlval: string | null = null;
  modalPrediction: any = null;
  patientList: any[] = [];
  selectedPatientId: string = '';
  environment = environment;

  userId: number | null = null;
  private searchDebounce?: any;
  pageIndex: number = 0;
  pageSize: number = 10;

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

  onSearchChange(value: string) {
    if (this.searchDebounce) clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      this.searchText = value || '';
      this.pageIndex = 0; // reset to first page on new search
    }, 300);
  }

  private normalizeText(v: any): string {
    return (v || '')
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  get filteredResults() {
    const t = this.normalizeText(this.searchText);
    if (!t) return this.predictions;
    return this.predictions.filter(p => {
      const name = this.normalizeText(p?.patient?.name);
      const lastname = this.normalizeText(p?.patient?.lastname);
      const dni = this.normalizeText(p?.patient?.dni);
      return name.includes(t) || lastname.includes(t) || dni.includes(t);
    });
  }

  get totalResults(): number {
    return this.filteredResults.length;
  }

  get startIndex(): number {
    return this.totalResults === 0 ? 0 : this.pageIndex * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.totalResults, (this.pageIndex + 1) * this.pageSize);
  }

  get pagedResults() {
    const start = this.pageIndex * this.pageSize;
    return this.filteredResults.slice(start, start + this.pageSize);
  }

  nextPage() { if (this.endIndex < this.totalResults) this.pageIndex++; }
  prevPage() { if (this.pageIndex > 0) this.pageIndex--; }

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
    this.tempSearchText = '';
    this.searchText = '';
    this.pageIndex = 0;
  
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