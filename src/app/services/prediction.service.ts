import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private apiUrl = 'https://localhost:44301/Sales/SalesDatePrediction';
  private authUrl = 'https://localhost:44301/Login/AuthenticateToken';

  constructor(private http: HttpClient) {}

  // Método para autenticación y obtención del token
  authenticate(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.authUrl, { Username: username, Password: password });
  }

  // Método para guardar el token en localStorage
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Método para obtener el token almacenado
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Método para obtener TODAS las predicciones de clientes
  getAllPredictions(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(this.apiUrl, { headers });
  }
}
