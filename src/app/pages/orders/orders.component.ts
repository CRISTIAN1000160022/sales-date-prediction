import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../services/orders.service'; // Asegúrate de que la ruta es correcta

@Component({
  selector: 'app-orders',
  standalone: true,
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = []; // Almacenará las órdenes obtenidas

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.authenticateAndFetchOrders();
  }

  // Método para autenticar y luego obtener órdenes
  authenticateAndFetchOrders(): void {
    this.ordersService.authenticate('admin', '123456').subscribe(response => {
      if (response.success) {
        this.ordersService.saveToken(response.Data); // Guardamos el token
        this.getOrdersByClient(1); // Llamamos a la API para obtener órdenes del cliente 1
      }
    });
  }

  // Método para obtener órdenes por cliente
  getOrdersByClient(clientId: number): void {
    this.ordersService.getOrdersByClient(clientId).subscribe(
      data => {
        this.orders = Array.isArray(data.Data) ? data.Data : [] // Asignamos las órdenes al array
        console.log('Órdenes obtenidas:', this.orders);
      },
      error => {
        console.error('Error al obtener órdenes:', error);
      }
    );
  }
}
