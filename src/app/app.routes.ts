import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProviderComponent } from './pages/provider/provider.component';
import { ProductComponent } from './pages/product/product.component';
import { SalesComponent } from './pages/sales/sales.component';
import { ReportComponent } from './pages/report/report.component';
import { ErrorComponent } from './pages/error/error.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'provider', component: ProviderComponent },
  { path: 'product', component: ProductComponent },
  { path: 'sales', component: SalesComponent },
  { path: 'report', component: ReportComponent },

  { path: '**', component: ErrorComponent },
];
