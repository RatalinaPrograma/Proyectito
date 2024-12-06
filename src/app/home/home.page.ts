import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ServiciobdService } from '../pages/services/serviciobd.service';
import { Browser } from '@capacitor/browser';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {




  horaActual: string | undefined;
  idRolUsuario: number | undefined;
  rutUsuario: string | undefined;
  constructor(private navCtrl: NavController, private router: Router, private serviciobd: ServiciobdService
  ) {}


  
  emergenciasActivas: any[] = [];


async ngOnInit() {
  this.actualizarHora();
  setInterval(() => {
    this.actualizarHora();
  }, 1000); // Actualiza la hora cada segundo

  this.obtenerDatosUsuario();

  try {
    const emergenciasActivas = await this.serviciobd.obtenerUltimasEmergenciasActivas();

    // Verifica el estado de cada emergencia activa
    for (const emergencia of emergenciasActivas) {
      await this.serviciobd.verificarEstadoEmergencia(emergencia.idEmerg);
    }

    this.emergenciasActivas = emergenciasActivas;
    alert('Emergencias activas cargadas correctamente.');
  } catch (error) {
    alert('Error al obtener emergencias activas: ' + JSON.stringify(error));
  }
}



  obtenerDatosUsuario() {
    const usuario1 = localStorage.getItem('usuario');
    if (usuario1) {
      const usuario = JSON.parse(usuario1);
      this.idRolUsuario = usuario.rol; // Rol del usuario
      this.rutUsuario = usuario.rut;   // RUT del usuario
    }
  }
  

  actualizarHora() {
    const ahora = new Date();
    this.horaActual = ahora.toLocaleTimeString(); // Esto da la hora en formato local HH:MM:SS
  }

  nuevaEmergencia() {
    // Lógica para crear una nueva emergencia
    console.log('Creando una nueva emergencia');
  }

  verHistorial() {
    // Lógica para ver el historial de emergencias
    console.log('Viendo el historial de emergencias');
  }

  irConfiguraciones() {
    // Lógica para ir a la configuración
    console.log('Navegando a la configuración');
  }

  // Funciones de navegación añadidas
  irchatvivo() {
    // Navega a la página de chat en vivo
    this.navCtrl.navigateRoot('/chat-vivo');
  }

  irlogin() {
    // Navega a la página de login de paramédico
    this.navCtrl.navigateRoot('/login-paramedico');
  }

  irconfgunidad() {
    // Navega a la página de configuración de unidad
    this.navCtrl.navigateRoot('/configuracion-unidad');
  }

  irHcasos() {
    // Navega a la página de historial de casos
    this.navCtrl.navigateRoot('/detalles-caso-anterior');
  }

  irPhospital() {
    // Navega a la página de preferencia de hospitales
    this.navCtrl.navigateRoot('/preferencia-hospital');
  }

  irSP() {
    // Navega a la página de soporte técnico
    this.navCtrl.navigateRoot('/soporte-tecnico');
  }

  async cargarEmergenciasActivas() {
    try {
      this.emergenciasActivas = await this.serviciobd.obtenerUltimasEmergenciasActivas();
    } catch (error) {
      console.error('Error al cargar emergencias activas:', error);
    }
  }


  async cambiarEstadoEmergencia(idEmerg: number, nuevoEstado: string) {
    try {
      await this.serviciobd.actualizarEstadoEmergencia(idEmerg, nuevoEstado);
      this.emergenciasActivas = await this.serviciobd.obtenerUltimasEmergenciasActivas(); // Actualiza la lista
    } catch (error) {
      console.error('Error al cambiar el estado de la emergencia:', error);
    }
  }

  async abrirNavegador() {
    await Browser.open({ url: 'https://www.davila.cl' });
  }

  async abrirNavegador2() {
    await Browser.open({ url: 'https://complejohospitalariosanjose.cl' });
  }

}

