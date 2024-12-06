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
    console.log('Emergencias activas cargadas correctamente.');
  } catch (error) {
    alert('Error al obtener emergencias activas: ' + JSON.stringify(error));
  }
}



  obtenerDatosUsuario() {
    const usuario1 = localStorage.getItem('usuario');
    if (usuario1) {
      const usuario = JSON.parse(usuario1);
      this.idRolUsuario = usuario.rol; 
      this.rutUsuario = usuario.rut;   
    }
  }
  

  actualizarHora() {
    const ahora = new Date();
    this.horaActual = ahora.toLocaleTimeString(); 
  }


  irchatvivo() {

    this.navCtrl.navigateRoot('/chat-vivo');
  }

  irlogin() {
    this.navCtrl.navigateRoot('/login-paramedico');
  }

  irconfgunidad() {
    this.navCtrl.navigateRoot('/configuracion-unidad');
  }

  irHcasos() {

    this.navCtrl.navigateRoot('/detalles-caso-anterior');
  }


  irConfrecep() {
    if (this.rutUsuario) {
      this.navCtrl.navigateRoot(`/conf-recep/${this.rutUsuario}`);
    } else {
      alert('Error: No se encontró un RUT válido.');
    }
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

