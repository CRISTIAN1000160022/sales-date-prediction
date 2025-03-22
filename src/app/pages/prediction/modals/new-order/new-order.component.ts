import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { OrderService } from '../../../../services/create-order.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-order',
  imports:  [FormsModule, ReactiveFormsModule],
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css'],
})
export class NewOrderComponent implements OnInit {
  @Input() customerName!: string;
  @Input() token!: string;
  @Output() orderCreated = new EventEmitter<void>();
  @Output() closeModalEvent = new EventEmitter<void>(); // Evento para cerrar el modal

  employees: any[] = [];
  shippers: any[] = [];
  products: any[] = []; // Lista de productos obtenida de la API

  orderData: any = {
    Empid: null,
    Shipid: null,
    Shipname: '',
    Shipaddress: '',
    Shipcity: '',
    Shipcountry: '',
    Orderdate: '',
    Requireddate: '',
    Shippeddate: '',
    Freight: null,
    Productid: null,
    Unitprice: null,
    Qty: null,
    Discount: null,
  };

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadEmployees();
    this.loadShippers();
  }

  loadProducts(): void {
    this.orderService.getAllProducts(this.token).subscribe(
      (response) => {
        this.products = response.Data || []; // Asigna los productos obtenidos
      },
      (error) => {
        console.error('Error al obtener productos:', error);
        alert('No se pudieron cargar los productos.');
      }
    );
  }

  loadEmployees(): void {
    this.orderService.getAllEmployees(this.token).subscribe(
      (response) => {
        this.employees = response.Data || []; // Asigna los empleados obtenidos
      },
      (error) => {
        console.error('Error al obtener empleados:', error);
        alert('No se pudieron cargar los empleados.');
      }
    );
  }

  loadShippers(): void {
    this.orderService.getAllShippers(this.token).subscribe(
      (response) => {
        this.shippers = response.Data || []; // Asigna los transportistas obtenidos
      },
      (error) => {
        console.error('Error al obtener transportistas:', error);
        alert('No se pudieron cargar los transportistas.');
      }
    );
  }

  // onFieldChange(event: Event): void {
  //   const target = event.target as HTMLInputElement | HTMLSelectElement;
  //   const fieldName = target.name; // Obtiene el nombre del campo
  //   const fieldValue = target.value; // Obtiene el valor del campo
  //   this.orderData[fieldName] = fieldValue; // Actualiza el modelo de datos
  // }

  onFieldChange(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const fieldName = target.name; // Obtiene el nombre del campo
    let fieldValue: any;

    // Verifica si el elemento es un <select> para capturar el valor seleccionado
    if (target.tagName === 'SELECT') {
      fieldValue = target.value; // Captura el valor del <option>
      if (!fieldValue) {
        console.warn(`El campo ${fieldName} no tiene un valor seleccionado.`);
      }
    } else {
      fieldValue = target.value; // Captura el valor del input
    }

    // Asigna el valor al modelo solo si es válido
    if (fieldValue !== null && fieldValue !== undefined && fieldValue !== '') {
      this.orderData[fieldName] = fieldValue; // Actualiza el modelo de datos
    } else {
      console.warn(`El campo ${fieldName} no tiene un valor válido.`);
    }

    // Log para depuración
    console.log(`Campo actualizado: ${fieldName}, Valor: ${fieldValue}`);
  }

  onSubmit(): void {
    const discount = parseFloat(this.orderData.Discount);
    if (isNaN(discount) || discount < 0 || discount > 1) {
      alert('El valor de Discount debe estar entre 0 y 1.');
      return; // Detener la ejecución si el valor no es válido
    }

    const payload = {
      Empid: parseInt(this.orderData.Empid, 10) || null, // INT
      Shipid: parseInt(this.orderData.Shipid, 10) || null, // INT
      Shipname: this.orderData.Shipname || '', // NVARCHAR(40)
      Shipaddress: this.orderData.Shipaddress || '', // NVARCHAR(60)
      Shipcity: this.orderData.Shipcity || '', // NVARCHAR(15)
      Orderdate: this.orderData.Orderdate ? new Date(this.orderData.Orderdate) : null, // DATETIME
      Requireddate: this.orderData.Requireddate ? new Date(this.orderData.Requireddate) : null, // DATETIME
      Shippeddate: this.orderData.Shippeddate ? new Date(this.orderData.Shippeddate) : null, // DATETIME
      Freight: parseFloat(this.orderData.Freight) || 0.0, // DECIMAL(18,2)
      Shipcountry: this.orderData.Shipcountry || '', // NVARCHAR(15)
      Productid: parseInt(this.orderData.Productid, 10) || null, // INT
      Unitprice: parseFloat(this.orderData.Unitprice) || 0.0, // DECIMAL(18,2)
      Qty: parseInt(this.orderData.Qty, 10) || 0, // INT
      Discount: parseFloat(this.orderData.Discount) || 0.0, // FLOAT
    };

    console.log('Enviando payload:', this.orderData);

    this.orderService.createOrder(payload, this.token).subscribe(
      (response) => {
        if (response) {
          alert('Order created successfully!');
          console.log('Objeto: ' + this.orderData);
          console.log('Respose: ' + response);

          // Agregar un tiempo de espera antes de cerrar el modal
          setTimeout(() => {
            this.orderCreated.emit(); // Notifica al padre que se creó la orden
            this.closeModal(); // Cierra el modal
          }, 2000); // 20000 ms = 20 segundos
        }
      },
      (error) => {
        console.error('Error creating order:', error);
        alert('Failed to create order.');
      }
    );
  }

  closeModal(): void {
    this.closeModalEvent.emit(); // Notifica al padre que debe cerrar el modal
  }
}
