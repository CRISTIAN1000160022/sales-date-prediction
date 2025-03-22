import { Component, OnInit } from '@angular/core';
import { PredictionService } from '../../services/prediction.service';

@Component({
  selector: 'app-prediction',
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

  constructor(private predictionService: PredictionService) {}

  ngOnInit(): void {
    this.authenticateAndFetchPredictions();
  }

  // Método para autenticar y luego obtener predicciones
  authenticateAndFetchPredictions(): void {
    this.predictionService.authenticate('admin', '123456').subscribe(response => {
      if (response.success) {
        this.predictionService.saveToken(response.Data); // Guardamos el token
        this.getPredictions();
      }
    });
  }

  // Método para obtener predicciones desde el servidor
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

  // Método para filtrar predicciones según el texto de búsqueda
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement; // Obtenemos el valor del input
    this.searchQuery = input.value; // Actualizamos manualmente searchQuery
    this.filteredPredictions = this.predictions.filter(prediction =>
      prediction.CustomerName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.updatePagination();
  }

  // Método para ordenar la tabla por una columna específica
  sortTable(column: string): void {
    this.filteredPredictions.sort((a, b) =>
      a[column] > b[column] ? 1 : a[column] < b[column] ? -1 : 0
    );
  }

  // Actualiza la paginación según las predicciones filtradas
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredPredictions.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  // Obtiene las predicciones de la página actual
  get paginatedPredictions(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredPredictions.slice(start, end);
  }

  // Cambia a la página anterior
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Cambia a la página siguiente
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Lógica para abrir el modal de "Orders View"
  viewOrders(prediction: any): void {
    console.log('View Orders:', prediction);
    // Aquí iría la lógica para abrir el modal
  }

  // Lógica para abrir el modal de "New Order"
  newOrder(prediction: any): void {
    console.log('New Order:', prediction);
    // Aquí iría la lógica para abrir el modal
  }
}
