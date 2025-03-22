import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'https://localhost:44301/Order/CreateNewOrder';
  private productsUrl = 'https://localhost:44301/Product/GetAllProducts';
  private employeesUrl = 'https://localhost:44301/Employee/GetAllEmployees';
  private shippersUrl = 'https://localhost:44301/Shipper/GetAllShippers';

  constructor(private http: HttpClient) {}

  createOrder(orderData: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(this.apiUrl, orderData, { headers });
  }

  getAllProducts(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(this.productsUrl, { headers });
  }

  getAllEmployees(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(this.employeesUrl, { headers });
  }

  getAllShippers(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(this.shippersUrl, { headers });
  }
}
