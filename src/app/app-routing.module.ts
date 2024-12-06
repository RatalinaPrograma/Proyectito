import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login-paramedico',
    pathMatch: 'full'
  },
  {
    path: 'nueva-emergencia',
    loadChildren: () => import('./pages/nueva-emergencia/nueva-emergencia.module').then( m => m.NuevaEmergenciaPageModule)
  },
  {
    path: 'reg-detallesmedicos',
    loadChildren: () => import('./pages/reg-detallesmedicos/reg-detallesmedicos.module').then( m => m.RegDetallesmedicosPageModule)
  },
  {
    path: 'reg-causaemergencia/:rut',
    loadChildren: () => import('./pages/reg-causaemergencia/reg-causaemergencia.module').then( m => m.RegCausaemergenciaPageModule)
  },
  {
    path: 'ev-nivelurgencia',
    loadChildren: () => import('./pages/ev-nivelurgencia/ev-nivelurgencia.module').then( m => m.EvNivelurgenciaPageModule)
  },
  {
    path: 'envio-info/:rut',
    loadChildren: () => import('./pages/envio-info/envio-info.module').then( m => m.EnvioInfoPageModule)
  },
  {
    path: 'conf-recepciont',
    loadChildren: () => import('./pages/conf-recepcion/conf-recepcion.module').then( m => m.ConfRecepcionPageModule)
  },
  {
    path: 'mapa-vivo',
    loadChildren: () =>
      import('./pages/mapa-vivo/mapa-vivo.module').then(
        (m) => m.MapaVivoPageModule
      ),
  },
  {
    path: 'historial-casos',
    loadChildren: () => import('./pages/historial-casos/historial-casos.module').then( m => m.HistorialCasosPageModule)
  },
  {
    path: 'detalles-caso-anterior',
    loadChildren: () => import('./pages/detalles-caso-anterior/detalles-caso-anterior.module').then( m => m.DetallesCasoAnteriorPageModule)
  },
  {
    path: 'ajustes-perfil-paramedico',
    loadChildren: () => import('./pages/ajustes-perfil-paramedico/ajustes-perfil-paramedico.module').then( m => m.AjustesPerfilParamedicoPageModule)
  },
  {
    path: 'configuracion-unidad',
    loadChildren: () => import('./pages/configuracion-unidad/configuracion-unidad.module').then( m => m.ConfiguracionUnidadPageModule)
  },
  {
    path: 'register-paramedico',
    loadChildren: () => import('./pages/register-paramedico/register-paramedico.module').then( m => m.RegisterParamedicoPageModule)
  },
  {
    path: 'login-paramedico',
    loadChildren: () => import('./pages/login-paramedico/login-paramedico.module').then( m => m.LoginParamedicoPageModule)
  },
  {
    path: 'olvido',
    loadChildren: () => import('./pages/olvido/olvido.module').then( m => m.OlvidoPageModule)
  },
  {
    path: 'crud-usuarios',
    loadChildren: () => import('./pages/crud-usuarios/crud-usuarios.module').then( m => m.CrudUsuariosPageModule)
  },

  {
    path: 'crud-pacientes',
    loadChildren: () => import('./pages/crud-pacientes/crud-pacientes.module').then( m => m.CrudPacientesPageModule)
  },
  {
    path: 'agregar-pacientes',
    loadChildren: () => import('./pages/agregar-pacientes/agregar-pacientes.module').then( m => m.AgregarPacientesPageModule)
  },
  {
    path: 'agregar-signos-vitales/:rut',
    loadChildren: () => import('./pages/agregar-signos-vitales/agregar-signos-vitales.module').then( m => m.AgregarSignosVitalesModule)
  },
  {
    path: 'modificar-signos-vitales/:rutPaciente',
    loadChildren: () => import('./pages/modificar-signos-vitales/modificar-signos-vitales.module').then( m => m.ModificarSignosVitalesModule)
  },
  {
    path: 'eliminar-pacientes/:rut',
    loadChildren: () => import('./pages/eliminar-pacientes/eliminar-pacientes.module').then( m => m.EliminarPacientesPageModule)
  },

  {
    path: 'modificar-usuarios/:id',
    loadChildren: () => import('./pages/modificar-usuarios/modificar-usuarios.module').then( m => m.ModificarUsuariosPageModule)
  },
  {
    path: 'modificar-pacientes/:rut',
    loadChildren: () => import('./pages/modificar-pacientes/modificar-pacientes.module').then( m => m.ModificarPacientesPageModule)
  },
  {
    path: 'crud-hospital',
    loadChildren: () => import('./pages/crud-hospital/crud-hospital.module').then( m => m.CrudHospitalPageModule)
  },
  {
    path: 'agregar-hospital',
    loadChildren: () => import('./pages/agregar-hospital/agregar-hospital.module').then( m => m.AgregarHospitalPageModule)
  },
  {
    path: 'modificar-hospital/:id',
    loadChildren: () => import('./pages/modificar-hospital/modificar-hospital.module').then( m => m.ModificarHospitalPageModule)
  },
  {
    path: 'cambio-clave',
    loadChildren: () => import('./pages/cambio-clave/cambio-clave.module').then( m => m.CambioClavePageModule)
  },
  {
    path: 'paciente-existe',
    loadChildren: () => import('./pages/paciente-existe/paciente-existe.module').then( m => m.PacienteExistePageModule)
  },
  {
    path: 'conf-recep/:rut',
    loadChildren: () => import('./pages/conf-recep/conf-recep.module').then( m => m.ConfRecepPageModule)
  },
  {
    path: 'verificar-codigo',
    loadChildren: () => import('./pages/verificar-codigo/verificar-codigo.module').then( m => m.VerificarCodigoPageModule)
  },
  {
    path: 'restablecer-contrasena',
    loadChildren: () => import('./pages/restablecer-contrasena/restablecer-contrasena.module').then( m => m.RestablecerContrasenaPageModule)
  },
  {
    path: 'mostrar-unidad/:id',
    loadChildren: () => import('./pages/mostrar-unidad/mostrar-unidad.module').then( m => m.MostrarUnidadPageModule)
  },
  {
    path: 'editar-unidad/:id',
    loadChildren: () => import('./pages/editar-unidad/editar-unidad.module').then( m => m.EditarUnidadPageModule)
  },
  {
    path: 'buscar-ambulancia',
    loadChildren: () => import('./pages/buscar-ambulancia/buscar-ambulancia.module').then( m => m.BuscarAmbulanciaPageModule)
  },
  {
    path: 'agregar-personas',
    loadChildren: () => import('./pages/agregar-personas/agregar-personas.module').then( m => m.AgregarPersonasPageModule )
  },
  {
    path: '**',
    loadChildren: () => import('./pages/not-found/not-found.module').then( m => m.NotFoundPageModule)
  },


















  

];

@NgModule({
  imports: [
    IonicModule.forRoot(),
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
