import { Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { HomeComponent } from './components/home/home.component';
import { QueryBuilderComponent } from './components/query-builder/query-builder.component';
import { ContainerComponent } from './components/container/container.component';

export const routes: Routes = [
  {
    path: '',
    component: ContainerComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'express-builder', component: QueryBuilderComponent }
      //   {
      //     path: 'customer',
      //     loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule)
      //   }
    ]
  }
];
