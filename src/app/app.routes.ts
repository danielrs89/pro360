import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ErrorComponent } from './pages/error/error.component';

import { ProviderComponent } from './pages/provider/provider.component';

import { ProductComponent } from './pages/products/product/product.component';
import { ProductIdComponent } from './pages/products/product-id/product-id.component';

import { SalesComponent } from './pages/sales/sales.component';
import { ReportComponent } from './pages/report/report.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  
  // { path: 'category', component:  },

  { path: 'provider', component: ProviderComponent },
  
  { path: 'product', component: ProductComponent },
  { path: 'product/:id', component: ProductIdComponent },
  
  { path: 'sales', component: SalesComponent },
  { path: 'report', component: ReportComponent },
  
  { path: '**', component: ErrorComponent },
];
