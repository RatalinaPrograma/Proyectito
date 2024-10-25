import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiciobdService } from '../services/serviciobd.service';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-modificar-pacientes',
  templateUrl: './modificar-pacientes.page.html',
  styleUrls: ['./modificar-pacientes.page.scss'],
})
export class ModificarPacientesPage implements OnInit {
  public rut: string = '';
  public hoy: string = ''; // Fecha de hoy en formato 'YYYY-MM-DD'
  public paciente: any = {
    idPaciente: 0,
    nombre: '',
    f_nacimiento: '',
    idGenero: 0,
    rut: '',
    telefono_contacto: ''
  };

  constructor(
    private route: ActivatedRoute, 
    private bdService: ServiciobdService,
    private alertController: AlertController,
    private location: Location
  ) { }

  ngOnInit() {
    this.hoy = new Date().toISOString().split('T')[0]; // Obtener la fecha actual
    this.rut = this.route.snapshot.paramMap.get('rut') || '';
    this.cargarPaciente(this.rut);
  }

  async cargarPaciente(rut: string) {
    try {
      const paciente = await this.bdService.obtenerPaciente(rut);
      if (paciente) {
        this.paciente = paciente;
        this.paciente.f_nacimiento = new Date(this.paciente.f_nacimiento).toISOString().split('T')[0];
      } else {
        this.presentAlert('Error', 'Paciente no encontrado.');
      }
    } catch (error) {
      this.presentAlert('Error', `Error al cargar el paciente: ${(error as any).message}`);
    }
  }

  async modificarPaciente(formulario: NgForm) {
    if (formulario.invalid) {
      this.presentAlert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    // Validación de la fecha de nacimiento
    if (this.paciente.f_nacimiento > this.hoy) {
      this.presentAlert('Error', 'La fecha de nacimiento no puede ser mayor a la fecha actual.');
      return;
    }

    try {
      const { idPaciente, nombre, f_nacimiento, idGenero, rut, telefono_contacto } = this.paciente;
      const res = await this.bdService.modificarPaciente(
        idPaciente,
        nombre,
        new Date(f_nacimiento),
        idGenero,
        rut,
        telefono_contacto
      );

      if (res.code === 'OK') {
        this.location.back(); // Regresar a la página anterior
      }
    } catch (error) {
      this.presentAlert('Error', `Error al modificar el paciente: ${(error as any).message}`);
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Aceptar']
    });

    await alert.present();
  }
}
