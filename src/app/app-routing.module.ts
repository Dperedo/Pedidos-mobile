import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  // {    path: 'folder/:id',    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)},
  {
    path: 'cliente',
    loadChildren: () => import('./pages/cliente/cliente.module').then( m => m.ClientePageModule)
  },
  {
    path: 'producto',
    loadChildren: () => import('./pages/producto/producto.module').then( m => m.ProductoPageModule)
  },
  {
    path: 'pedido',
    loadChildren: () => import('./pages/pedido/pedido.module').then( m => m.PedidoPageModule)
  },
  {
    path: 'formulario-cliente',
    loadChildren: () => import('./pages/formulario-cliente/formulario-cliente.module').then( m => m.FormularioClientePageModule)
  },
  {
    path: 'formulario-producto',
    loadChildren: () => import('./pages/formulario-producto/formulario-producto.module').then( m => m.FormularioProductoPageModule)
  },
  {
    path: 'formulario-pedido',
    loadChildren: () => import('./pages/formulario-pedido/formulario-pedido.module').then( m => m.FormularioPedidoPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
