import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full'
  },
   {
     path: 'inicio',
     loadChildren: () => import('./pages/inicio/inicio.module').then(m => m.InicioPageModule)
   },
 
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule)
  },
  {
    path: 'info',
    loadChildren: () => import('./pages/info/info.module').then(m => m.InfoPageModule)
  }
  // ,{
  //   path: 'reservar',
  //   loadChildren: () => import('./pages/reservar/reservar.module').then( m => m.ReservarPageModule)
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
