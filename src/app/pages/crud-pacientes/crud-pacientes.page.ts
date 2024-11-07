import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Pacientes } from '../services/pacientes';
import { ServiciobdService } from '../services/serviciobd.service';
import { AlertasService } from '../services/alertas.service';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-crud-pacientes',
  templateUrl: './crud-pacientes.page.html',
  styleUrls: ['./crud-pacientes.page.scss'],
})
export class CrudPacientesPage implements OnInit, OnDestroy, ViewWillEnter {
  pacientes: Pacientes[] = [];
  paciente: Pacientes = {
    nombre: '',
    f_nacimiento: new Date(),
    idGenero: 0,
    rut: '',
    telefono_contacto: ''
  };
  private intervalId: any;

  constructor(
    private router: Router,
    private baseDatos: ServiciobdService,
    private alertasService: AlertasService
  ) { }

  ngOnInit() {
    this.listarPacientes();
    this.startAutoRefresh();
  }

  ngOnDestroy() {
    this.stopAutoRefresh();
  }

  ionViewWillEnter() {
    this.listarPacientes();
  }

  startAutoRefresh() {
    this.intervalId = setInterval(() => {
      this.listarPacientes();
    }, 120000); // Actualiza cada 2 minutos
  }

  stopAutoRefresh() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  listarPacientes() {
    this.baseDatos.consultartablaPaciente()
      .then((res: Pacientes[]) => {        
        this.pacientes = res;
        console.log(this.pacientes); // Debugging
      })
      .catch((error) => {
        console.error(`ERROR ${error}`);
        alert(`ERROR ${error}`);
      });
  }
  

  async guardarPaciente() {
    // Validaciones antes de guardar
    const mensajeError = this.validarFormulario();
    if (mensajeError) {
      this.alertasService.presentAlert('Error en registro', mensajeError);
      return;
    }

    try {
      await this.baseDatos.agregarPaciente(
        this.paciente.nombre,
        new Date(this.paciente.f_nacimiento),
        this.paciente.idGenero,
        this.paciente.rut,
        this.paciente.telefono_contacto
      ); // Guardar en la base de datos
      console.log('Paciente guardado con éxito');

    } catch (error) {
      console.error('Error al guardar el paciente:', error);
      alert('Hubo un problema al guardar el paciente. Intente nuevamente.');
    }
  }

  validarFormulario(): string {
    // Validación de campos vacíos
    if (
      !this.paciente.nombre ||
      !this.paciente.rut ||
      !this.paciente.telefono_contacto ||
      !this.paciente.f_nacimiento ||
      !this.paciente.idGenero
    ) {
      return 'Todos los campos son obligatorios.';
    }

    // Validación de nombre completo (solo letras y espacios, mínimo 2 caracteres)
    const soloLetrasYEspacios = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (this.paciente.nombre.length < 2 || !soloLetrasYEspacios.test(this.paciente.nombre)) {
      return 'El nombre debe tener al menos 2 caracteres y solo puede contener letras y espacios.';
    }

    // Validación del RUT
    if (!this.validarRut(this.paciente.rut)) {
      return 'El RUT ingresado es inválido.';
    }

    // Validación del formato del teléfono
    if (!/^\+569[0-9]{8}$/.test(this.paciente.telefono_contacto)) {
      return 'El teléfono debe seguir el formato +569XXXXXXXX.';
    }

    return ''; // Si todas las validaciones pasan
  }

  validarRut(rut: string): boolean {
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

    return dv === dvCalculado;
  }


  verPacientes() {
    this.router.navigate(['/ver-pacientes']); 
  }

  agregarPacientes() {
    this.router.navigate(['/agregar-pacientes']); 
  }

  eliminarPacientes(rut: string) {
    if (!rut) {
      alert('RUT no válido');
      return;
    }

    if (confirm('¿Está seguro de que desea eliminar a este paciente?')) {
      this.baseDatos.eliminarPaciente(rut)
        .then(() => {
          this.listarPacientes();
        })
        .catch((error) => { 
          alert(`ERROR ${error}`); 
        });
    }
  }

  modificarPacientes(rut: string) {
    if (!rut) {
      alert('RUT no válido');
      return;
    }

    this.baseDatos.obtenerPaciente(rut)
      .then((paciente) => {
        if (paciente) {
          this.router.navigate(['/modificar-pacientes', rut]);
        } else {
          alert('Paciente no encontrado');
        }
      })
      .catch((error) => {
        alert(`ERROR ${error}`);
      });
  }

  verReporte() {
    this.router.navigate(['/home']); 
  }

  calcularEdad(fechaNacimiento: string | Date): number {
    const fechaNac = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();

    const mesActual = hoy.getMonth();
    const diaActual = hoy.getDate();
    const mesNacimiento = fechaNac.getMonth();
    const diaNacimiento = fechaNac.getDate();

    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
      edad--;
    }
    return edad;
  }

  administrarSignosPacientes(rut: string, idSignosVitales?: number) {
    if (idSignosVitales) {
      this.router.navigate(['/modificar-signos-vitales', rut]);
    } else {
      this.router.navigate(['/agregar-signos-vitales', rut]);
    }
  }

}
