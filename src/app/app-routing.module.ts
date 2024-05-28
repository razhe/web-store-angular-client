import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { LayoutComponent } from './Components/layout/layout.component';

const routes: Routes = [
  { path: '', component:LoginComponent, pathMatch: 'full' },
  { path: 'login', component:LoginComponent, pathMatch: 'full' },

  // A continuacion se aplicará lazy loading de los componenetes, es decir, se cargarán cuando se les llama
  {
    path: 'pages',
    loadChildren: () => import("./Components/layout/layout.module")
      .then(x => x.LayoutModule)
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
