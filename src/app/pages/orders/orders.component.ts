import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importa el servicio Router
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  @Input() predictions: any[] = [];
  customerName = ' ';
  filteredPredictions: any[] = [];
  orders: any[] = [];
  filteredOrders: any[] = [];
  searchQuery = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  constructor(private ordersService: OrdersService, private router: Router) {} // Inyecta el Router

  ngOnInit(): void {
    if (this.predictions.length > 0) {
      this.filteredPredictions = [...this.predictions];
      this.authenticateAndFetchOrders();
      this.updatePagination();
      this.customerName = this.predictions[0].CustomerName;
    }
  }

  authenticateAndFetchOrders(): void {
    this.ordersService.authenticate('admin', '123456').subscribe(response => {
      if (response.success) {
        this.ordersService.saveToken(response.Data);
        const customerId = this.predictions[0].CustomerId;
        console.log('CustomerID:', customerId);
        this.getOrdersByClient(customerId);
      }
    });
  }

  getOrdersByClient(clientId: number): void {
    this.ordersService.getOrdersByClient(clientId).subscribe(
      data => {
        this.orders = Array.isArray(data.Data) ? data.Data : [];
        this.filteredOrders = [...this.orders];
        this.updatePagination();
      },
      error => {
        console.error('Error al obtener órdenes:', error);
      }
    );
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.filteredOrders = this.orders.filter(order =>
      order.shipname.toString().includes(this.searchQuery)
    );
    this.updatePagination();
  }

  sortTable(column: string): void {
    this.filteredOrders.sort((a, b) =>
      a[column] > b[column] ? 1 : a[column] < b[column] ? -1 : 0
    );
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  get paginatedOrders(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredOrders.slice(start, end);
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

  returnHome(): void {
    window.location.href = '/prediction'; // Redirige y recarga la página // Navega a la ruta '/prediction'
  }
}
