import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { ServiciobdService } from '../services/serviciobd.service';

@Component({
  selector: 'app-historial-casos',
  templateUrl: './historial-casos.page.html',
  styleUrls: ['./historial-casos.page.scss'],
})
export class HistorialCasosPage implements OnInit {
  datosTabla: any[] = [];

  constructor(
    private file: File,
    private fileOpener: FileOpener,
    private bdService: ServiciobdService // Inyectar el servicio de base de datos
  ) {}

  ngOnInit(): void {
    this.cargarDatos(); // Cargar los datos al inicializar la página
  }

  // Obtener los datos desde la base de datos
  async cargarDatos() {
    try {
      this.datosTabla = await this.bdService.obtenerDatosConNombrePaciente();
      console.log('Datos cargados:', this.datosTabla); // Verifica que "nombre" esté incluido en la consola
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
  }

  // Generar el archivo Excel
  generarExcel() {
    const datosParaExcel = this.datosTabla.map((dato) => ({
      Nombre: dato.nombre, // Incluye el nombre del paciente
      ID: dato.idSigno,
      'Frecuencia Cardiaca': dato.freq_cardiaca,
      'Presión Arterial': dato.presion_arterial,
      'Temperatura Corporal': dato.temp_corporal,
      'Saturación de Oxígeno': dato.sat_oxigeno,
      'Frecuencia Respiratoria': dato.freq_respiratoria,
      Condiciones: dato.condiciones,
      Operaciones: dato.operaciones,
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosParaExcel);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SignosVitales');

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.guardarYAbrirExcel(buffer);
  }

  // Guardar y abrir el archivo Excel
  async guardarYAbrirExcel(buffer: any) {
    const nombreArchivo = 'signos_vitales.xlsx';
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    try {
      const ruta = this.file.dataDirectory;
      await this.file.writeFile(ruta, nombreArchivo, data, { replace: true });
      await this.fileOpener.open(ruta + nombreArchivo, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      console.log('Archivo Excel abierto con éxito');
    } catch (error) {
      console.error('Error al guardar o abrir el archivo:', error);
    }
  }
}
