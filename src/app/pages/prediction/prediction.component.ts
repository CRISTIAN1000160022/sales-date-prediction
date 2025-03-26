import { Component, OnInit } from '@angular/core';
import { PredictionService } from '../../services/prediction.service';
import { OrdersComponent } from '../orders/orders.component';
import { NewOrderComponent } from './modals/new-order/new-order.component';

@Component({
  selector: 'app-prediction',
  imports: [OrdersComponent,NewOrderComponent],
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent implements OnInit {
  predictions: any[] = []; // Almacenará las predicciones obtenidas
  filteredPredictions: any[] = []; // Predicciones filtradas para búsqueda y paginación
  searchQuery = ''; // Texto de búsqueda
  currentPage = 1; // Página actual
  itemsPerPage = 10; // Elementos por página
  totalPages = 1; // Total de páginas
  selectedPrediction: any = null; // Predicción seleccionada para mostrar en OrdersComponent
  isModalOpen = false; // Controla la visibilidad del modal
  token = ''; 
  customerName = '';

  constructor(private predictionService: PredictionService) {}

  ngOnInit(): void {
    this.authenticateAndFetchPredictions();
  }

  authenticateAndFetchPredictions(): void {
    this.predictionService.authenticate('admin', '123456').subscribe(response => {
      if (response.success) {
        this.predictionService.saveToken(response.Data);
        this.token = response.Data;
        this.getPredictions();
      }
    });
  }

  getPredictions(): void {
    this.predictionService.getAllPredictions().subscribe(
      data => {
        this.predictions = Array.isArray(data.Data) ? data.Data : []; // Validamos que sea un array
        this.filteredPredictions = [...this.predictions]; // Inicializamos las predicciones filtradas
        this.updatePagination();
      },
      error => {
        console.error('Error al obtener predicciones:', error);
      }
    );
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.filteredPredictions = this.predictions.filter(prediction =>
      prediction.CustomerName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.updatePagination();
  }

  sortTable(column: string): void {
    this.filteredPredictions.sort((a, b) =>
      a[column] > b[column] ? 1 : a[column] < b[column] ? -1 : 0
    );
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredPredictions.length / this.itemsPerPage);
    this.currentPage = 1; // Reinicia a la primera página al cambiar el número de elementos por página
  }

  get paginatedPredictions(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredPredictions.slice(start, end);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  viewOrders(prediction: any): void {
    console.log('View Orders:', prediction);
    this.selectedPrediction = prediction; // Asigna la predicción seleccionada
  }

  newOrder(prediction: any): void {
    this.isModalOpen = true; // Abre el modal
    this.customerName = prediction.CustomerName; // Asigna el nombre del cliente
  }

  onOrderCreated(): void {
    this.isModalOpen = false; // Cierra el modal
    this.getPredictions(); // Refresca las predicciones
  }

  // Método para reemplazar Math.min
  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  closeModal(): void {
    this.isModalOpen = false; // Cierra el modal
  }

  // Método para manejar el cambio de filas por página
  onItemsPerPageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(select.value, 10); // Actualiza el número de elementos por página
    this.updatePagination(); // Actualiza la paginación
  }
}
