import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ErrorComponent } from './pages/error/error.component';

import { ProviderComponent } from './pages/providers/provider/provider.component';
import { ProviderIdComponent } from './pages/providers/provider-id/provider-id.component';

import { ProductComponent } from './pages/product/product.component';
import { SalesComponent } from './pages/sales/sales.component';
import { ReportComponent } from './pages/report/report.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'provider', component: ProviderComponent },
  { path: 'provider/:id', component: ProviderIdComponent },
  { path: 'product', component: ProductComponent },
  { path: 'sales', component: SalesComponent },
  { path: 'report', component: ReportComponent },

  { path: '**', component: ErrorComponent },
];
