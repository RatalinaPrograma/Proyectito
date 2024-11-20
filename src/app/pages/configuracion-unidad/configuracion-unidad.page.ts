import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ServiciobdService } from '../services/serviciobd.service';

@Component({
  selector: 'app-configuracion-unidad',
  templateUrl: './configuracion-unidad.page.html',
  styleUrls: ['./configuracion-unidad.page.scss'],
})
export class ConfiguracionUnidadPage implements OnInit {
  patente: string = '';
  patenteConfirmacion: string = '';
  equipada: boolean = false;
  fec_mant: string = '';
  idestado: number | null = null;
  estados: any[] = [];
  idUnidad: number | undefined;

  constructor(
    private alertCtrl: AlertController,
    private serviciobd: ServiciobdService,
    private router: Router
  ) {}

  get patenteCoincide(): boolean {
    return this.patente === this.patenteConfirmacion;
  }

  get formatoPatenteValido(): boolean {
    const formatoPatente = /^[A-Z]{4}\d{2}$/;
    return formatoPatente.test(this.patente);
  }

  async ngOnInit() {
    await this.cargarEstados();
  }

  async cargarEstados() {
    try {
      this.estados = await this.serviciobd.listarEstados();
    } catch (error) {
      console.error('Error al cargar los estados:', error);
      this.presentAlert('Error', 'No se pudieron cargar los estados disponibles.');
    }
  }

  async verificarPatenteExistente(): Promise<boolean> {
    try {
      const existe = await this.serviciobd.verificarAmbulanciaPorPatente(this.patente);
      return existe;
    } catch (error) {
      console.error('Error al verificar la existencia de la ambulancia:', error);
      return false;
    }
  }

  async guardarAmbulancia() {
    if (!this.patente || !this.fec_mant || this.idestado === null) {
      await this.presentAlert('Campos incompletos', 'Por favor, complete todos los campos.');
      return;
    }
    
    if (!this.patenteCoincide) {
      await this.presentAlert('Error', 'Las patentes ingresadas no coinciden.');
      return;
    }

    if (!this.formatoPatenteValido) {
      await this.presentAlert('Error', 'El formato de la patente es incorrecto. Debe ser ABCD12.');
      return;
    }

    const existe = await this.verificarPatenteExistente();
    if (existe) {
      await this.presentAlert('Error', 'Esta ambulancia ya está registrada.');
      return;
    }
  
    try {
      const res = await this.serviciobd.agregarAmbulancia(this.patente, this.equipada, this.fec_mant, this.idestado);
      const insertId = res.insertId;
      this.idUnidad = insertId;
  
      await this.presentAlert('Éxito', 'Ambulancia registrada correctamente.');
      this.router.navigate(['/mostrar-unidad', this.idUnidad]);
  
      this.patente = '';
      this.patenteConfirmacion = '';
      this.equipada = false;
      this.fec_mant = '';
      this.idestado = null;
    } catch (error) {
      console.error('Error al guardar la ambulancia:', error);
      await this.presentAlert('Error', 'No se pudo registrar la ambulancia. Intente nuevamente.');
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
