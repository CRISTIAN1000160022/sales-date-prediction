import { Routes } from '@angular/router';
// import { OrdersComponent } from './pages/orders/orders.component';
import { PredictionComponent } from './pages/prediction/prediction.component';

export const routes: Routes = [
  { path: 'prediction', component: PredictionComponent },
  { path: '', redirectTo: '/prediction', pathMatch: 'full' }, // Redirección por defecto
];
