import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ServiciobdService } from '../services/serviciobd.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AlertasService } from '../services/alertas.service';
import { Pacientes } from '../services/pacientes';

@Component({
  selector: 'app-envio-info',
  templateUrl: './envio-info.page.html',
  styleUrls: ['./envio-info.page.scss'],
})
export class EnvioInfoPage implements OnInit {
 
  public rut: string = '';

  paciente: Pacientes ={
    // Variables para almacenar los datos del paciente
    nombre:'',
    f_nacimiento: new Date(), 
    idGenero: 0,
    rut: '',
    telefono_contacto: '',
    };


  
  constructor(private router: Router,
    private route: ActivatedRoute,
    private baseDatos: ServiciobdService
  ) {

  }
  
  obteneralPaciente() {    
    this.baseDatos.obtenerPaciente(this.rut)
      .then((res) => {

        res.edad = new Date().getFullYear() - new Date(res.f_nacimiento).getFullYear();
        this.paciente = res;
      })
      .catch( (error) => {
        console.error(`ERROR ${error}`)
        alert('ERROR al tratar de obtener al paciente.')
      });
  }

  ngOnInit() {
    this.rut = this.route.snapshot.paramMap.get('rut') || '';
    this.obteneralPaciente();
  }

  enviarEmergencia() {
    const navigationExtras: NavigationExtras = {
      state: {
        paciente: this.paciente
      }
    };
    this.router.navigate(['nueva-emergencia'], navigationExtras);
  }

  avanzar() {
    this.router.navigate(['conf-recepcion']);
  }
 


}
