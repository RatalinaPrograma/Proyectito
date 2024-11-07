import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { ServiciobdService } from '../services/serviciobd.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AlertasService } from '../services/alertas.service';
import { Pacientes } from '../services/pacientes';
import { EnvioInfoPage } from '../envio-info/envio-info.page';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-nueva-emergencia',
  templateUrl: './nueva-emergencia.page.html',
  styleUrls: ['./nueva-emergencia.page.scss'],
  providers: [provideNativeDateAdapter()],
})
export class NuevaEmergenciaPage implements OnInit {
  paciente: Pacientes ={
  // Variables para almacenar los datos del paciente
  nombre:'',
  f_nacimiento: new Date(), 
  idGenero: 0,
  rut: '',
  telefono_contacto: '+569',
  };

  constructor(
    private router: Router, 
    private baseDatos: ServiciobdService,

  ) {}


  ngOnInit() {}


  private validarRut(rut: string): boolean {
    const rutLimpio = rut.replace(/\./g, '').replace('-', '').trim();
  
    if (rutLimpio.length < 8 || rutLimpio.length > 9) {
      console.log('RUT inválido: longitud incorrecta');
      return false;
    }
  
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toUpperCase();
  
    if (!/^[0-9]+$/.test(cuerpo)) {
      console.log('RUT inválido: el cuerpo contiene caracteres no numéricos');
      return false;
    }
  
    let suma = 0;
    let multiplicador = 2;
  
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo.charAt(i), 10) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
  
    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
  
    if (dv !== dvCalculado) {
      console.log(`RUT inválido: dígito verificador no coincide (esperado: ${dvCalculado}, obtenido: ${dv})`);
      return false;
    }
  
    return true;
  }
  
  async guardarPaciente() {
    const esFormularioValido = await this.validarFormulario();
    if (!esFormularioValido) {
      console.log('Formulario no válido');
      return; // Detiene la ejecución si el formulario es inválido
    }
  
    if (!this.paciente.telefono_contacto.startsWith('+56')) {
      this.paciente.telefono_contacto = `+56${this.paciente.telefono_contacto}`;
    }
  
    try {
      const res = await this.baseDatos.agregarPaciente(
        this.paciente.nombre,
        this.paciente.f_nacimiento,
        this.paciente.idGenero,
        this.paciente.rut,
        this.paciente.telefono_contacto
      );
      
      console.log('Paciente guardado con éxito:', res);
      this.router.navigate(['/envio-info', this.paciente.rut]);

  
    } catch (error) {
      console.error('Error al guardar el paciente:', error);
      alert('Hubo un problema al guardar el paciente. Por favor, intenta nuevamente.');
    }
  }
  
  
  
  private async validarFormulario(): Promise<boolean> {
    const hoy = new Date();
    const fechaNacimiento = this.paciente.f_nacimiento ? new Date(this.paciente.f_nacimiento) : null;
    const telefonoRegex = /^\+569\d{8}$/;
  
    // Validación del nombre
    if (!this.paciente.nombre || this.paciente.nombre.trim().length < 2) {
      alert('Por favor, ingrese el nombre completo del paciente. Debe tener al menos 2 caracteres.');
      console.log('Validación fallida: Nombre vacío o demasiado corto');
      return false;
    }
  
    // Validación de la fecha de nacimiento
    if (!fechaNacimiento || isNaN(fechaNacimiento.getTime())) {
      alert('Por favor, ingrese una fecha de nacimiento válida.');
      console.log('Validación fallida: Fecha de nacimiento inválida');
      return false;
    }
    if (fechaNacimiento > hoy) {
      alert('La fecha de nacimiento no puede ser mayor a la fecha actual.');
      console.log('Validación fallida: Fecha de nacimiento en el futuro');
      return false;
    }
  
    // Validación del género
    if (![1, 2, 3].includes(this.paciente.idGenero)) {
      alert('Por favor, seleccione un género válido para el paciente.');
      console.log('Validación fallida: Género inválido o no seleccionado');
      return false;
    }
  
    // Validación del RUT
    if (!this.paciente.rut || this.paciente.rut.trim() === '') {
      alert('Por favor, ingrese el RUT del paciente.');
      console.log('Validación fallida: RUT vacío');
      return false;
    } else if (!this.validarRut(this.paciente.rut)) {
      alert('Por favor, ingrese un RUT válido.');
      console.log('Validación fallida: RUT no válido');
      return false;
    }
  
    // Validación del teléfono de contacto
    if (!this.paciente.telefono_contacto || !telefonoRegex.test(this.paciente.telefono_contacto)) {
      alert('El teléfono de contacto debe comenzar con +569 y seguir el formato +569XXXXXXXX.');
      console.log('Validación fallida: Teléfono de contacto inválido');
      return false;
    }
  
    console.log('Todas las validaciones pasaron');
    return true;
  }

  async enviarEmergencia(){
    
  }
  
}
