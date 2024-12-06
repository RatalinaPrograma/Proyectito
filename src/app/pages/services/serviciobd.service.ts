import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Pacientes } from './pacientes';
import { Trabajador } from './trabajador';
import { Rol } from './rol';
import { AlertasService } from './alertas.service';
import { Location } from '@angular/common';
import { SignosVitales } from './signosVitales.model';
import { Confirmacion } from './confirmacion';

@Injectable({
  providedIn: 'root'
})
export class ServiciobdService {
  public rutMedico: string = '';
  executeSql(query: string, arg1: number[]) {
    throw new Error('Method not implemented.');
  }
  sqliteService: any;
  presentToast(arg0: string) {
    throw new Error('Method not implemented.');
  }

  public database!: SQLiteObject;
  isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private dbIsCreated: boolean = false;

  // Sentencias SQL de creación de tablas


  tablaRol: string = "CREATE TABLE IF NOT EXISTS rol(idrol INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(100) NOT NULL);";

  tablaGenero: string = "CREATE TABLE IF NOT EXISTS genero(idgenero INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(100) NOT NULL);";

  tablaPersona: string = "CREATE TABLE IF NOT EXISTS persona(idPersona INTEGER PRIMARY KEY AUTOINCREMENT, nombres VARCHAR(100) NOT NULL, apellidos VARCHAR(100) NOT NULL, rut VARCHAR(50) NOT NULL UNIQUE, correo VARCHAR(100) NOT NULL UNIQUE, clave VARCHAR(100) NOT NULL, telefono VARCHAR(15), foto BLOB, idRol INTEGER, FOREIGN KEY (idRol) REFERENCES rol(idrol));";

  tablaHospital: string = "CREATE TABLE IF NOT EXISTS hospital(idHospital INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(100) NOT NULL, direccion VARCHAR(255) NOT NULL);";

  tablaAmbulancia: string = "CREATE TABLE IF NOT EXISTS ambulancia(idambulancia INTEGER PRIMARY KEY AUTOINCREMENT, patente VARCHAR(100) NOT NULL, equipada BOOLEAN NOT NULL, fec_mant DATE NOT NULL, idestado INTEGER NOT NULL, FOREIGN KEY (idestado) REFERENCES estado(idestado));";

  tablaTriage: string = "CREATE TABLE IF NOT EXISTS triage(idTriage INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(100) NOT NULL);";

  tablaPaciente: string = "CREATE TABLE IF NOT EXISTS paciente(idPaciente INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(100) NOT NULL, f_nacimiento DATE NOT NULL, idGenero INTEGER, rut VARCHAR(50) NOT NULL UNIQUE, telefono_contacto VARCHAR(15), idSigno INTEGER, FOREIGN KEY (idGenero) REFERENCES genero(idgenero), FOREIGN KEY (idSigno) REFERENCES signos_vitales(idSigno));";

  tablaPersonal: string = "CREATE TABLE IF NOT EXISTS personal(idpersonal INTEGER PRIMARY KEY AUTOINCREMENT, idHospital INTEGER, idPersona INTEGER, FOREIGN KEY (idHospital) REFERENCES hospital(idHospital), FOREIGN KEY (idPersona) REFERENCES persona(idPersona));";

  tablaTrabajador: string = "CREATE TABLE IF NOT EXISTS trabajador(idTrab INTEGER PRIMARY KEY AUTOINCREMENT, idambulancia INTEGER, idPersona INTEGER, FOREIGN KEY (idambulancia) REFERENCES ambulancia(idambulancia), FOREIGN KEY (idPersona) REFERENCES persona(idPersona));";

  tablaEmergencia: string = "CREATE TABLE IF NOT EXISTS emergencia(idEmerg INTEGER PRIMARY KEY AUTOINCREMENT, fecha_emer DATE NOT NULL, motivo VARCHAR(255), desc_motivo TEXT, observaciones TEXT, estado VARCHAR(50), f_recepcion DATE, idambulancia INTEGER, idTriage INTEGER, idHospital INTEGER, idPaciente INTEGER, FOREIGN KEY (idambulancia) REFERENCES ambulancia(idambulancia), FOREIGN KEY (idTriage) REFERENCES triage(idTriage), FOREIGN KEY (idHospital) REFERENCES hospital(idHospital), FOREIGN KEY (idPaciente) REFERENCES paciente(idPaciente));";

  tablaDetalle: string = "CREATE TABLE IF NOT EXISTS detalle(idDetalle INTEGER PRIMARY KEY AUTOINCREMENT, idEmerg INTEGER, idPaciente INTEGER, FOREIGN KEY (idEmerg) REFERENCES emergencia(idEmerg), FOREIGN KEY (idPaciente) REFERENCES paciente(idPaciente));";

  tablaSignosV: string = "CREATE TABLE IF NOT EXISTS signos_vitales(idSigno INTEGER PRIMARY KEY AUTOINCREMENT, freq_cardiaca INTEGER, presion_arterial VARCHAR(10), temp_corporal INTEGER, sat_oxigeno INTEGER, freq_respiratoria INTEGER, condiciones TEXT, operaciones TEXT);";

  tablaDetalle_S: string = "CREATE TABLE IF NOT EXISTS detalle_s(idDetalleS INTEGER PRIMARY KEY AUTOINCREMENT, idDetalle INTEGER, idSigno INTEGER, valor VARCHAR(100), unidad VARCHAR(50), FOREIGN KEY (idDetalle) REFERENCES detalle(idDetalle), FOREIGN KEY (idSigno) REFERENCES signos_vitales(idSigno));";

  tablaConfirmacion: string = "CREATE TABLE IF NOT EXISTS confirmacion(idConfirmacion INTEGER PRIMARY KEY AUTOINCREMENT,idEmerg INTEGER,idPersona INTEGER,fecha_confirmacion DATE NOT NULL,estado_confirmacion BOOLEAN NOT NULL, FOREIGN KEY (idEmerg) REFERENCES emergencia(idEmerg),FOREIGN KEY (idPersona) REFERENCES persona(idPersona));"

  tablaEstado: string = "CREATE TABLE IF NOT EXISTS estado(idestado INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(100) NOT NULL);";

  listadoPacientes: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  listadoTrabajador: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  listadoRol: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  listadoPersona: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  listadoGenero: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  listadoPersonal: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  listadoAmbulancia: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  listadoEstado: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  listadoHospital: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  listadoSignosV: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  listadoDetalle: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  listadoEmergencia: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  listadoTriage: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);


  constructor(private sqlite: SQLite, private platform: Platform, private alertController: AlertController, private AlertasService: AlertasService,
    private location: Location) {
    this.crearBD();
  }

  crearBD() {
    if (this.dbIsCreated) return;

    this.platform.ready().then(async () => {
      try {
        const db = await this.sqlite.create({
          name: 'pulseTrack.db',
          location: 'default',
        });

        this.database = db;
       console.log('Info', 'Base de datos creada correctamente.');

        // Elimina tablas (solo en desarrollo)
        //  await this.database.executeSql('DROP TABLE IF EXISTS persona;', []);
        await this.database.executeSql('DROP TABLE IF EXISTS emergencia;', []);
        // Crea las tablas
        console.log('Info', 'Creando tablas...');
        await this.crearTablas();
        console.log('Info', 'Tablas creadas correctamente.');

        // Inserta datos iniciales
        await this.verificarTablaPersona();

        await this.insertarEstadosIniciales();

        await this.insertarUsuarioPredeterminado();
  
        await this.insertarGenerosPredeterminado();


        this.isDBReady.next(true);
        this.dbIsCreated = true;
        console.log('Éxito', 'Base de datos inicializada correctamente.');
      } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
        await this.presentAlert('Error', `No se pudo inicializar la base de datos. Error: ${(error as any).message}`);
      }
    });
  }


  async crearTablas() {
    const tablas = [
      this.tablaRol,
      this.tablaGenero,
      this.tablaPersona,
      this.tablaAmbulancia,
      this.tablaTrabajador,
      this.tablaHospital,
      this.tablaSignosV,
      this.tablaDetalle,
      this.tablaDetalle_S,
      this.tablaEmergencia,
      this.tablaTriage,
      this.tablaPaciente,
      this.tablaConfirmacion,
      this.tablaEstado,
    ];

    for (const query of tablas) {
      try {
        await this.database.executeSql(query, []);
        console.log(`Tabla creada correctamente: ${query}`);
      } catch (e) {
        console.error('Error creando tabla:', query, e);
        throw new Error(`Error creando tabla: ${query}`);
      }
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

  fetchPacientes(): Observable<Pacientes[]> {
    return this.listadoPacientes.asObservable();
  }

  fetchTrabajador(): Observable<Trabajador[]> {
    return this.listadoTrabajador.asObservable();
  }

  fetchRol(): Observable<Rol[]> {
    return this.listadoRol.asObservable();
  }

  // Agregar SIGNOS VITALES

  operaciones!: string;

  agregarSignosV(freq_cardiaca: number, presion_arterial: string, temp_corporal: number, sat_oxigeno: number, freq_respiratoria: number, condiciones: string, operaciones: string, rutPaciente: string) {
    return this.database.executeSql('INSERT OR IGNORE INTO signos_vitales (freq_cardiaca, presion_arterial, temp_corporal, sat_oxigeno, freq_respiratoria,condiciones,operaciones) VALUES (?, ?, ?, ?, ?,?,?)', [freq_cardiaca, presion_arterial, temp_corporal, sat_oxigeno, freq_respiratoria, condiciones, operaciones])
      .then(async res => {
        await this.agregarSignoAPaciente(rutPaciente, res.insertId);

      })
      .catch(e => {
        this.AlertasService.presentAlert("Agregar signos vitales", "Ocurrió un error: " + JSON.stringify(e));
      });
  }

  agregarSignoAPaciente(rutPaciente: string, idSigno?: number) {
    const query = `UPDATE paciente SET idSigno = ? WHERE rut = ?`;
    return this.database.executeSql(query, [idSigno, rutPaciente])
      .then(res => {
        return { code: 'OK', message: 'Paciente modificado', changes: res.rowsAffected };
      })
      .catch(async e => {
        if (idSigno) {
          await this.eliminarSignosVitales(idSigno, rutPaciente);
        }
        return { code: 'ERROR', message: `No se pudo actualizar el id signo vital en paciente ${idSigno} rut: ${rutPaciente} ERROR: ${JSON.stringify(e)}`, changes: null };
      });
  }

  modificarSignosVitales(idSigno: number, freq_cardiaca: number, presion_arterial: string, temp_corporal: number, sat_oxigeno: number, freq_respiratoria: number, condiciones: string, operaciones: string) {
    if (idSigno != 0) {
      return this.database.executeSql('UPDATE signos_vitales SET freq_cardiaca = ?, presion_arterial = ?, temp_corporal = ?, sat_oxigeno = ?, freq_respiratoria = ?, condiciones = ?, operaciones = ? WHERE idSigno = ?',
        [freq_cardiaca, presion_arterial, temp_corporal, sat_oxigeno, freq_respiratoria, condiciones, operaciones, idSigno])
        .then(async res => {
          this.AlertasService.presentAlert("Modificar signos vitales", `Signos vitales modificados correctamente.`);
        })
        .catch(e => {
          this.AlertasService.presentAlert("Modificar signos vitales", "Ocurrió un error: " + JSON.stringify(e));
        });
    } else {
      this.AlertasService.presentAlert("Modificar signos vitales", "Ocurrió un error: No existen signos vitales.");
      throw new Error("Ocurrió un error: No existen signos vitales.");
    }
  }

  consultartablaSignosVitalesPorRutPaciente(rutPaciente: string): Promise<SignosVitales> {
    return this.database.executeSql(`
          SELECT  signos_vitales.idSigno, 
                  signos_vitales.freq_cardiaca,
                  signos_vitales.presion_arterial,
                  signos_vitales.temp_corporal,
                  signos_vitales.sat_oxigeno,
                  signos_vitales.freq_respiratoria,
                  signos_vitales.condiciones,
                  signos_vitales.operaciones
          FROM paciente 
          INNER JOIN signos_vitales ON paciente.idSigno = signos_vitales.idSigno
          WHERE paciente.rut = ?`, [rutPaciente]).then(res => {

      let signos: SignosVitales;
      if (res.rows.length > 0) {
        signos = {
          idSigno: res.rows.item(0).idSigno,
          freq_cardiaca: res.rows.item(0).freq_cardiaca,
          presion_arterial: res.rows.item(0).presion_arterial,
          temp_corporal: res.rows.item(0).temp_corporal,
          sat_oxigeno: res.rows.item(0).sat_oxigeno,
          freq_respiratoria: res.rows.item(0).freq_respiratoria,
          condiciones: res.rows.item(0).condiciones,
          operaciones: res.rows.item(0).operaciones,
        }
      } else {
        throw new Error(`No se encontraron signos vitales para este paciente con rut ${rutPaciente}.`);
      }
      return signos;
    }).catch(err => {
      // Captura cualquier error que ocurra en el proceso
      this.AlertasService.presentAlert(
        "Obtener signos vitales",
        "Ocurrió un error: " + err.message
      );
      return Promise.reject(new Error(`Error al Obtener signos vitales del paciente: ${err.message}`));
    });;
  }

  verificarSignosVitales(idSigno: number): Promise<boolean> {
    const query = `SELECT COUNT(*) as count FROM signos_vitales WHERE idSigno = ?`;
    return this.database.executeSql(query, [idSigno]).then(res => {
      return res.rows.item(0).count > 0;
    });
  }

  eliminarSignosVitales(idSigno: number, rutPaciente: string): Promise<any> {
    if (idSigno != 0) {
      return this.verificarSignosVitales(idSigno).then(async existe => {
        if (!existe) {
          return Promise.reject(new Error('No se encontraron signos vitales para eliminar.'));
        }
        const query = `DELETE FROM signos_vitales WHERE idSigno = ?`;
        return this.database.executeSql(query, [idSigno]).then(async res => {
          const agregadoSignoAPaciente = await this.agregarSignoAPaciente(rutPaciente, undefined);
          if (agregadoSignoAPaciente.code === 'OK') {
            this.AlertasService.presentAlert("Eliminar signos vitales", "Signos vitales eliminados correctamente.");
            this.location.back();
            return { message: 'Signos vitales eliminados', changes: res.rowsAffected };
          } else {
            throw new Error('Error al eliminar signos vitales de paciente rut ' + rutPaciente);
          }
        });
      }).catch(err => {
        return Promise.reject(new Error(`Error al eliminar signos vitales: ${err.message}`));
      });
    } else {
      this.AlertasService.presentAlert("Eliminar signos vitales", "Ocurrió un error: No existen signos vitales.");
      throw new Error("Ocurrió un error: No existen signos vitales.");
    }
  }

  // PACIENTE

  agregarPaciente(
    nombre: string,
    f_nacimiento: Date,
    idGenero: number,
    rut: string,
    telefono_contacto: string
  ): Promise<number> {
    return this.verificarPaciente(rut).then((existe) => {
      if (existe) {
        // Si el paciente ya existe, mostramos un error
        console.log('Agregar paciente', 'El paciente con ese RUT ya está registrado.');
        return Promise.reject(new Error('Paciente ya registrado'));
      }

      // Si no existe, lo agregamos a la base de datos
      const query = `INSERT INTO paciente (nombre, f_nacimiento, idGenero, rut, telefono_contacto) VALUES (?, ?, ?, ?, ?)`;
      return this.database
        .executeSql(query, [
          nombre,
          f_nacimiento.toISOString(), // Asegúrate de pasar la fecha en formato ISO
          idGenero,
          rut,
          telefono_contacto,
        ])
        .then((res) => {
          if (res.insertId) {
            console.log('Paciente agregado correctamente con ID:', res.insertId);
            return res.insertId; // Retorna el ID del paciente recién creado
          } else {
            throw new Error('No se generó un ID para el paciente.');
          }
        });
    }).catch((err) => {
      // Captura cualquier error que ocurra en el proceso
      this.AlertasService.presentAlert('Agregar paciente', 'Ocurrió un error: ' + err.message);
      return Promise.reject(new Error(`Error al agregar el paciente: ${err.message}`));
    });
  }



  consultartablaPaciente(): Promise<Pacientes[]> {
    return this.database.executeSql(`
      SELECT  idPaciente,
              p.nombre,
              f_nacimiento,
              g.nombre as genero,
              rut,
              telefono_contacto,
              idSigno
      FROM paciente p
      JOIN genero g ON p.idgenero = g.idgenero
      `, []).then(res => {
      let itemsR: Pacientes[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          itemsR.push({
            idPaciente: res.rows.item(i).idPaciente,
            nombre: res.rows.item(i).nombre,
            f_nacimiento: res.rows.item(i).f_nacimiento,
            genero: res.rows.item(i).genero,
            rut: res.rows.item(i).rut,
            telefono_contacto: res.rows.item(i).telefono_contacto,
            idSignosVitales: res.rows.item(i).idSigno
          });
        }
      }
      return itemsR;
    });
  }

  obtenerPaciente(rut: string) {
    return this.database.executeSql(`SELECT * FROM paciente where rut = ?`, [rut]).then(res => {
      let paciente: Pacientes = {
        nombre: '',
        f_nacimiento: new Date(),
        idGenero: 0,
        rut: '',
        telefono_contacto: '',
      };

      if (res.rows.length > 0) {
        paciente = {
          idPaciente: res.rows.item(0).idPaciente,
          nombre: res.rows.item(0).nombre,
          f_nacimiento: res.rows.item(0).f_nacimiento,
          idGenero: res.rows.item(0).idGenero,
          rut: res.rows.item(0).rut,
          telefono_contacto: res.rows.item(0).telefono_contacto,
        }
      }
      return paciente;
    });
  }

  async obtenerDatosConNombrePaciente(): Promise<any[]> {
    const query = `
      SELECT signos_vitales.*, paciente.nombre 
      FROM signos_vitales
      INNER JOIN paciente ON signos_vitales.idSigno = paciente.idSigno
    `;

    const resultado: any = await this.database.executeSql(query, []);
    const datos = [];
    for (let i = 0; i < resultado.rows.length; i++) {
      datos.push(resultado.rows.item(i));
    }
    return datos;
  }


  modificarPaciente(idPaciente: number, nombre: string, f_nacimiento: Date, idGenero: number, rut: string, telefono_contacto: string): Promise<any> {
    return this.verificarPaciente(rut).then(existe => {
      if (!existe) {
        this.AlertasService.presentAlert("Modificar paciente", "El paciente con ese RUT no está registrado.");
        return Promise.reject(new Error('Paciente no registrado'));
      }

      const query = `UPDATE paciente SET nombre = ?, f_nacimiento = ?, idGenero = ?, rut = ?, telefono_contacto = ? WHERE idPaciente = ?`;
      return this.database.executeSql(query, [nombre, f_nacimiento, idGenero, rut, telefono_contacto, idPaciente])
        .then(res => {
          this.AlertasService.presentAlert("Modificar paciente", "Paciente modificado correctamente.");
          return { code: 'OK', message: 'Paciente modificado', changes: res.rowsAffected };
        });
    }).catch(err => {
      console.error("Modificar paciente", "Ocurrió un error: " + err.message);
      return Promise.reject(new Error(`Error al modificar el paciente: ${err.message}`));
    });
  }


  verificarPaciente(rut: string): Promise<boolean> {
    const query = `SELECT COUNT(*) as count FROM paciente WHERE rut = ?`;
    return this.database.executeSql(query, [rut]).then(res => {
      return res.rows.item(0).count > 0;
    });
  }

  eliminarPaciente(rut: string): Promise<any> {
    return this.verificarPaciente(rut).then(existe => {
      if (!existe) {
        return Promise.reject(new Error('No se encontró el paciente con el RUT proporcionado.'));
      }
      const query = `DELETE FROM paciente WHERE rut = ?`;
      return this.database.executeSql(query, [rut]).then(res => {
        this.AlertasService.presentAlert("Eliminar paciente", "Paciente eliminado correctamente.");
        return { message: 'Paciente eliminado', changes: res.rowsAffected };
      });
    }).catch(err => {
      return Promise.reject(new Error(`Error al eliminar el paciente: ${err.message}`));
    });
  }


  //HOSPITAL

  agregarHospital(nombre: string, direccion: string): Promise<any> {
    const query = `INSERT INTO hospital (nombre, direccion) VALUES (?, ?)`;
    return this.database.executeSql(query, [nombre, direccion]);
  }

  consultarTablaHospital(): Promise<any[]> {
    const query = `SELECT * FROM hospital`;
    return this.database.executeSql(query, []).then((res) => {
      const hospitales: any[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        hospitales.push(res.rows.item(i));
      }
      return hospitales;
    });
  }

  eliminarHospital(idHospital: number): Promise<any> {
    const query = `DELETE FROM hospital WHERE idHospital = ?`;
    return this.database.executeSql(query, [idHospital]);
  }

  verificarHospital(idHospital: number): Promise<boolean> {
    const query = `SELECT COUNT(*) as count FROM hospital WHERE idHospital = ?`;
    return this.database.executeSql(query, [idHospital]).then((res) => {
      return res.rows.item(0).count > 0;
    });
  }

  modificarHospital(
    idHospital: number,
    nombre: string,
    direccion: string
  ): Promise<any> {
    console.log('Modificando hospital con ID:', idHospital); // Debugging

    return this.verificarHospital(idHospital).then((existe) => {
      if (!existe) {
        this.AlertasService.presentAlert(
          'Modificar hospital',
          'El hospital con ese ID no está registrado.'
        );
        return Promise.reject(new Error('Hospital no registrado'));
      }

      const query = `UPDATE hospital SET nombre = ?, direccion = ? WHERE idHospital = ?`;
      console.log('Ejecutando consulta SQL:', query); // Debugging

      return this.database.executeSql(query, [nombre, direccion, idHospital])
        .then((res) => {
          console.log('Resultado de la modificación:', res); // Verifica si se realizó la modificación
          if (res.rowsAffected > 0) {
            return { message: 'Hospital modificado', changes: res.rowsAffected };
          } else {
            return { message: 'No se realizaron cambios', changes: res.rowsAffected };
          }
        });
    }).catch((err) => {
      console.error('Error al modificar el hospital:', err); // Debugging
      this.AlertasService.presentAlert(
        'Modificar hospital',
        'Ocurrió un error: ' + (err as Error).message
      );
      return Promise.reject(new Error(`Error al modificar el hospital: ${err.message}`));
    });
  }



  obtenerHospital(idHospital: number): Promise<any> {
    const query = `SELECT * FROM hospital WHERE idHospital = ?`;
    return this.database.executeSql(query, [idHospital]).then((res) => {
      if (res.rows.length > 0) {
        return res.rows.item(0);
      }
      return;
    });
  }





  ///////////////////////////////////////////////////////////////////////////
  // Función para registrar un usuario con validaciones

  async insertarRolesIniciales() {
    const roles = [
      { id: 1, nombre: 'Admin' },
      { id: 2, nombre: 'Paramédico' },
      { id: 3, nombre: 'Médico' }
    ];

    for (const rol of roles) {
      const query = `INSERT OR IGNORE INTO rol (idrol, nombre) VALUES (?, ?)`;
      await this.database.executeSql(query, [rol.id, rol.nombre]);
    }
  }



//////////////////////////////////////////////////////////////////////
async register(persona: any): Promise<boolean> {
  // Normaliza el RUT
  persona.rut = this.normalizarRut(persona.rut);

  // Valida el formato del RUT
  if (!/^[0-9]{7,8}-[0-9Kk]{1}$/.test(persona.rut)) {
    await this.AlertasService.presentAlert('Error en registro', 'El RUT debe tener el formato 12345678-9.');
    return false;
  }

  // Valida el RUT completo
  if (!this.validarRutCompleto(persona.rut)) {
    await this.AlertasService.presentAlert('Error en registro', 'El RUT ingresado es inválido.');
    return false;
  }

  // Verifica si el RUT ya existe
  const queryRut = 'SELECT COUNT(*) as count FROM persona WHERE rut = ?';
  const rutExiste = await this.database.executeSql(queryRut, [persona.rut]);

  if (rutExiste.rows.item(0).count > 0) {
    await this.AlertasService.presentAlert('Error en registro', 'El RUT ya está registrado.');
    return false;
  }

  // Verifica si el correo ya existe
  const queryCorreo = 'SELECT COUNT(*) as count FROM persona WHERE correo = ?';
  const correoExiste = await this.database.executeSql(queryCorreo, [persona.correo]);

  if (correoExiste.rows.item(0).count > 0) {
    await this.AlertasService.presentAlert('Error en registro', 'El correo ya está registrado.');
    return false;
  }

  // Inserta el usuario si las validaciones pasaron
  const query = `
    INSERT INTO persona (nombres, apellidos, rut, correo, clave, telefono, foto, idRol) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    persona.nombres.trim(),
    persona.apellidos.trim(),
    persona.rut.trim(),
    persona.correo.trim(),
    persona.clave,
    persona.telefono,
    persona.foto || null,
    persona.idRol,
  ];

  try {
    await this.database.executeSql(query, values);
    return true;
  } catch (error) {
    console.error('Error al registrar usuario:', error);

    // Manejo de errores específicos
    if ((error as any).code === 'SQLITE_CONSTRAINT') {
      if ((error as any).message.includes('rut')) {
        await this.AlertasService.presentAlert('Error en registro', 'El RUT ya está registrado.');
      } else if ((error as any).message.includes('correo')) {
        await this.AlertasService.presentAlert('Error en registro', 'El correo ya está registrado.');
      }
    } else {
      await this.AlertasService.presentAlert('Error en registro', 'El registro falló. Verifique los datos.');
    }

    return false;
  }
}


normalizarRut(rut: string): string {
  return rut.trim().replace(/[^0-9Kk-]/g, '').toUpperCase();
}

validarRutCompleto(rut: string): boolean {
  const rutLimpio = this.normalizarRut(rut);
  if (!/^[0-9]{7,8}-[0-9Kk]{1}$/.test(rutLimpio)) return false;

  const [cuerpo, dv] = rutLimpio.split('-');
  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const dvCalculado = 11 - (suma % 11);
  const dvEsperado = dvCalculado === 11 ? '0' : dvCalculado === 10 ? 'K' : dvCalculado.toString();

  return dvEsperado === dv.toUpperCase();
}



  // Obtener persona por ID
  // Servicio: obtenerUsuario() en ServiciobdService
  async obtenerUsuario(idPersona: number): Promise<any> {
    const query = 'SELECT * FROM persona WHERE idPersona = ?';

    try {
      const res = await this.database.executeSql(query, [idPersona]);
      if (res.rows.length > 0) {
        console.log('Usuario encontrado:', res.rows.item(0)); // Depuración
        return res.rows.item(0); // Retorna el primer registro encontrado
      } else {
        console.warn('No se encontró ningún usuario con el ID proporcionado.'); // Depuración
        return null; // No se encontró el usuario
      }
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw error; // Lanza el error para manejarlo en el componente
    }
  }





  // Validación de los campos del usuario
  private validarDatos(persona: any): boolean {
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const rutRegex = /^[0-9]+-[0-9kK]{1}$/;

    return (
      persona.nombres &&
      persona.apellidos &&
      rutRegex.test(persona.rut) &&
      correoRegex.test(persona.correo) &&
      persona.clave &&
      persona.idRol !== undefined
    );
  }

  // Función mejorada para iniciar sesión



  // Crear tabla si no existe
  crearTablaPersona() {
    const query = `CREATE TABLE IF NOT EXISTS persona(
      idPersona INTEGER PRIMARY KEY AUTOINCREMENT,
      nombres VARCHAR(100) NOT NULL,
      apellidos VARCHAR(100) NOT NULL,
      rut VARCHAR(50) NOT NULL UNIQUE,
      correo VARCHAR(100) NOT NULL UNIQUE,
      clave VARCHAR(100) NOT NULL,
      telefono VARCHAR(15),
      foto BLOB,
      idRol INTEGER,
      FOREIGN KEY (idRol) REFERENCES rol(idrol)
    );`;
    return this.database.executeSql(query, []);
  }

  // Listar personas
  listarPersonas(): Promise<any[]> {
    const query = 'SELECT * FROM persona';
    return this.database.executeSql(query, []).then((res) => {
      let personas: any[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        personas.push(res.rows.item(i));
      }
      return personas;
    });
  }

  // Agregar persona
  agregarPersona(persona: any) {
    const query = `INSERT INTO persona (nombres, apellidos, rut, correo, clave, telefono, foto, idRol) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [persona.nombres, persona.apellidos, persona.rut, persona.correo, persona.clave,
    persona.telefono, persona.foto, persona.idRol];
    return this.database.executeSql(query, values);
  }

  // Modificar persona
  modificarPersona(persona: any) {
    const query = `
      UPDATE persona 
      SET nombres = ?, apellidos = ?, rut = ?, correo = ?, 
          clave = ?, telefono = ?, foto = ?, idRol = ? 
      WHERE idPersona = ?`;

    const values = [
      persona.nombres, persona.apellidos, persona.rut, persona.correo,
      persona.clave, persona.telefono, persona.foto, persona.idRol, persona.idPersona
    ];

    return this.database.executeSql(query, values);
  }


  // Eliminar persona
  eliminarPersona(idPersona: number) {
    const query = 'DELETE FROM persona WHERE idPersona = ?';
    return this.database.executeSql(query, [idPersona]);
  }

  async listarUsuarios(): Promise<any[]> {
    const query = 'SELECT * FROM persona';
    try {
      const res = await this.database.executeSql(query, []);
      const usuarios = [];
      for (let i = 0; i < res.rows.length; i++) {
        usuarios.push(res.rows.item(i));
      }
      console.log('Usuarios en la base de datos:', usuarios);
      return usuarios;
    } catch (error) {
      console.error('Error al listar usuarios:', error);
      throw error;
    }
  }


  async insertarUsuarioPredeterminado() {
    const valores = [
      'Catalina',
      'Gutiérrez',
      'catalinagutierrez2516@gmail.com', // Correo predeterminado
      'Admin.123', // Contraseña
      '+56994125336', // Teléfono
      null, // Foto
      1, // Rol (Admin)
      this.normalizarRut('21273766-6'), // Normaliza el RUT
    ];

    try {
      // Verifica si el usuario ya existe (por correo o RUT)
      const existeCorreo = await this.database.executeSql('SELECT COUNT(*) as count FROM persona WHERE correo = ?', [valores[2]]);
      const existeRut = await this.database.executeSql('SELECT COUNT(*) as count FROM persona WHERE rut = ?', [valores[7]]);

      if (existeCorreo.rows.item(0).count > 0) {
        console.log('El correo ya está registrado.');
        return; // No hace nada si el correo ya existe
      }

      if (existeRut.rows.item(0).count > 0) {
        console.log('El RUT ya está registrado.');
        return; // No hace nada si el RUT ya existe
      }

      // Si no existe, inserta el usuario
      const query = `
        INSERT INTO persona (nombres, apellidos, correo, clave, telefono, foto, idRol, rut) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await this.database.executeSql(query, valores);
      console.log('Usuario predeterminado insertado correctamente.');
    } catch (error) {
      console.error('Error al insertar usuario predeterminado:', error);
      throw error; // Lanza el error para manejarlo más arriba
    }
  }


  async insertarGenerosPredeterminado() {
    const valores = [
      [1, 'Masculino'],
      [2, 'Femenino'],
      [3, 'Otro'],
    ];

    try {
      for (const valor of valores) {
        const sql = `
          INSERT OR IGNORE INTO genero (idgenero, nombre) 
          VALUES (?, ?)`;

        await this.database.executeSql(sql, valor);
        console.log(`Género insertado: ${valor[1]}`);
      }
      console.log('Todos los géneros predeterminados han sido insertados.');
    } catch (error) {
      console.error('Error al insertar géneros predeterminados:', error);
      throw error;
    }
  }

  async verificarTablaPersona() {
    const query = "SELECT name FROM sqlite_master WHERE type='table' AND name='persona'";
    try {
      const res = await this.database.executeSql(query, []);
      if (res.rows.length > 0) {
        console.log('La tabla "persona" existe.');
      } else {
        console.error('La tabla "persona" no existe.');
      }
    } catch (error) {
      console.error('Error al verificar la tabla "persona":', error);
    }
  }



  async verificarUsuario(rut: string): Promise<boolean> {
    const rutLimpio = this.normalizarRut(rut);
    const query = 'SELECT COUNT(*) as count FROM persona WHERE rut = ?';
    try {
      const res = await this.database.executeSql(query, [rutLimpio]);
      return res.rows.item(0).count > 0;
    } catch (error) {
      console.error('Error al verificar usuario:', error);
      throw new Error('No se pudo verificar el usuario');
    }
  }



  async login(rut: string, password: string): Promise<any | null> {
    const query = 'SELECT * FROM persona WHERE rut = ? AND clave = ?';

    try {
      const res = await this.database.executeSql(query, [rut, password]);
      console.log('Resultado de la consulta SQL:', res);

      // Verifica si hay resultados en la consulta
      if (res.rows.length > 0) {
        const usuario = res.rows.item(0);
        console.log('Usuario encontrado:', usuario);
        return usuario; // Retorna el usuario si existe
      } else {
        console.warn('No se encontraron coincidencias para las credenciales proporcionadas.');
        return null; // Retorna null si no hay coincidencias
      }
    } catch (error) {
      console.error('Error al ejecutar la consulta SQL en login:', error);
      throw new Error('Error al consultar la base de datos: ' + (error as any).message);
    }
  }





  async modificarClave(idPersona: number, nuevaClave: string): Promise<void> {
    const query = `UPDATE persona SET clave = ? WHERE idPersona = ?`;
    try {
      await this.database.executeSql(query, [nuevaClave, idPersona]);
      console.log('Contraseña actualizada correctamente para el usuario con ID:', idPersona);
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      throw new Error('No se pudo actualizar la contraseña');
    }
  }

  async obtenerUsuarioPorCorreoYRut(correo: string, rut: string): Promise<any> {
    const query = 'SELECT * FROM persona WHERE correo = ? AND rut = ?';
    try {
      const res = await this.database.executeSql(query, [correo, rut]);
      if (res.rows.length > 0) {
        return res.rows.item(0); // Retorna el usuario si ambos valores coinciden
      }
      return null; // Retorna null si no hay coincidencias
    } catch (error) {
      console.error('Error al obtener usuario por correo y RUT:', error);
      throw error;
    }
  }






  ////////////////////////

  async obtenerTodosLosSignosVitales(): Promise<SignosVitales[]> {
    const query = 'SELECT * FROM signos_vitales';
    try {
      const resultado = await this.database.executeSql(query, []);
      const signosVitales: SignosVitales[] = [];
      for (let i = 0; i < resultado.rows.length; i++) {
        const item = resultado.rows.item(i);
        const signo = new SignosVitales(
          item.idSigno,
          item.freq_cardiaca,
          item.presion_arterial,
          item.temp_corporal,
          item.sat_oxigeno,
          item.freq_respiratoria,
          item.condiciones,
          item.operaciones
        );
        signosVitales.push(signo);
      }
      return signosVitales;
    } catch (error) {
      console.error('Error al obtener los signos vitales:', error);
      throw error;
    }
  }


  async obtenerUltimaConfirmacionConDetalles(): Promise<any> {
    const query = `
      SELECT c.estado_confirmacion, c.fecha_confirmacion, 
             p.nombres AS nombreMedico, p.apellidos AS apellidoMedico, 
             e.motivo AS motivoEmergencia, e.observaciones AS observacionesEmergencia
      FROM confirmacion c
      INNER JOIN persona p ON c.idPersona = p.idPersona
      INNER JOIN emergencia e ON c.idEmerg = e.idEmerg
      ORDER BY c.idConfirmacion DESC
      LIMIT 1
    `;
    const resultado = await this.database.executeSql(query, []);
    if (resultado.rows.length > 0) {
      return resultado.rows.item(0);
    }
    return null;
  }


  recuperarClave(email: string): Promise<boolean> {
    // Lógica para recuperar clave
    return Promise.resolve(true);
  }


  async guardarConfirmacion(confirmacion: Confirmacion): Promise<void> {
    const query = `
      INSERT INTO confirmacion (idEmerg, idPersona, fecha_confirmacion, estado_confirmacion) 
      VALUES (?, ?, ?, ?)
    `;
    try {
      await this.database.executeSql(query, [
        confirmacion.idEmerg,
        confirmacion.idPersona,
        new Date().toISOString(),
        confirmacion.estado_confirmacion ? 1 : 0 // Convertir a 1 o 0 para booleanos
      ]);
      console.log('Confirmación guardada correctamente');
    } catch (error) {
      console.error('Error al guardar la confirmación en la base de datos:', error);
      throw new Error('Error en la base de datos: ' + (error as any).message);
    }
  }


  async obtenerUltimaConfirmacion(): Promise<any> {
    const query = 'SELECT * FROM confirmacion ORDER BY idConfirmacion DESC LIMIT 1';
    const resultado = await this.database.executeSql(query, []);
    if (resultado.rows.length > 0) {
      return resultado.rows.item(0);
    }
    return null;
  }

  async obtenerUltimasEmergenciasActivas(): Promise<any[]> {
    const query = `
      SELECT * FROM emergencia
      WHERE estado = 'activo'
      ORDER BY fecha_emer DESC
      LIMIT 10
    `;
  
    try {
      const resultado = await this.database.executeSql(query, []);
      const emergencias = [];
      for (let i = 0; i < resultado.rows.length; i++) {
        emergencias.push(resultado.rows.item(i));
      }
  
      if (emergencias.length > 0) {
        alert('Emergencias activas obtenidas correctamente.');
      } else {
        alert('No hay emergencias activas registradas.');
      }
  
      return emergencias;
    } catch (error) {
      alert('Error al obtener emergencias activas: ' + JSON.stringify(error));
      throw error;
    }
  }
  
  async verificarEstadoEmergencia(idEmerg: number): Promise<void> {
    const query = `SELECT estado FROM emergencia WHERE idEmerg = ?`;
  
    try {
      const resultado = await this.database.executeSql(query, [idEmerg]);
      if (resultado.rows.length > 0) {
        const estado = resultado.rows.item(0).estado;
        alert('Estado de la emergencia: ' + estado);
      } else {
        alert('La emergencia no existe.');
      }
    } catch (error) {
      alert('Error al verificar el estado de la emergencia: ' + JSON.stringify(error));
      throw error;
    }
  }
  
  
  


  async actualizarEstadoEmergencia(idEmerg: number, nuevoEstado: string): Promise<void> {
    const query = 'UPDATE emergencia SET estado = ? WHERE idEmerg = ?';
    try {
      await this.database.executeSql(query, [nuevoEstado, idEmerg]);
      console.log(`Estado de emergencia con ID ${idEmerg} actualizado a ${nuevoEstado}`);
    } catch (error) {
      console.error('Error al actualizar el estado de la emergencia:', error);
      throw error;
    }
  }

  
  async agregarEmergencia(motivo: string, descripcionMotivo: string, notas: string, idPaciente: number): Promise<void> {
    const fechaEmergencia = new Date().toISOString(); // Fecha actual
    const estado = 'activo'; // Estado predeterminado como 'activo'
  
    const query = `
      INSERT INTO emergencia (fecha_emer, motivo, desc_motivo, observaciones, estado, idPaciente)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
  
    try {
      const res = await this.database.executeSql(query, [fechaEmergencia, motivo, descripcionMotivo, notas, estado, idPaciente]);
      alert('Emergencia guardada correctamente con estado activo.');
  
      // Verificar el estado de la emergencia registrada
      const idEmerg = res.insertId; // Obtén el ID de la emergencia recién creada
      await this.verificarEstadoEmergencia(idEmerg); // Llama a la función aquí
  
    } catch (error) {
      alert('Error al guardar la emergencia: ' + JSON.stringify(error));
      throw error;
    }
  }
  
  
  





  async obtenerUltimaEmergencia(): Promise<any> {
    const query = 'SELECT * FROM emergencia ORDER BY idEmerg DESC LIMIT 1';
    try {
      const resultado = await this.database.executeSql(query, []);
      if (resultado.rows.length > 0) {
        return resultado.rows.item(0);
      }
      return null;
    } catch (error) {
      console.error('Error al obtener la última emergencia:', error);
      throw error;
    }
  }

  async obtenerRutPorIdPaciente(idPaciente: number): Promise<string | null> {
    const query = `SELECT rut FROM paciente WHERE idPaciente = ?`;
    try {
      const resultado = await this.database.executeSql(query, [idPaciente]);
      if (resultado.rows.length > 0) {
        return resultado.rows.item(0).rut;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener el RUT:', error);
      throw error;
    }
  }

  async agregarAmbulancia(patente: string, equipada: boolean, fec_mant: string, idestado: number): Promise<{ insertId: number }> {
    const query = `
    INSERT INTO ambulancia (patente, equipada, fec_mant, idestado)
    VALUES (?, ?, ?, ?)
  `;
    try {
      const res = await this.database.executeSql(query, [patente, equipada ? 1 : 0, fec_mant, idestado]);
      return { insertId: res.insertId };
    } catch (error) {
      console.error('Error al guardar la ambulancia en la base de datos:', error);
      throw error;
    }
  }




  async listarEstados(): Promise<any[]> {
    const query = `SELECT idestado, nombre FROM estado`;
    try {
      const resultado = await this.database.executeSql(query, []);
      const estados = [];
      for (let i = 0; i < resultado.rows.length; i++) {
        estados.push(resultado.rows.item(i));
      }
      return estados;
    } catch (error) {
      console.error('Error al listar estados:', error);
      throw error;
    }
  }

  async insertarEstadosIniciales() {
    const estados = [
      { id: 1, nombre: 'Disponible' },
      { id: 2, nombre: 'Mantenimiento' },
      { id: 3, nombre: 'En Servicio' },
    ];

    for (const estado of estados) {
      const query = `INSERT OR IGNORE INTO estado (idestado, nombre) VALUES (?, ?)`;
      await this.database.executeSql(query, [estado.id, estado.nombre]);
    }
  }

  listarAmbulancias(): Promise<any[]> {
    const query = `SELECT * FROM ambulancia`;
    return this.database.executeSql(query, []).then((res) => {
      const ambulancias: any[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        ambulancias.push(res.rows.item(i));
      }
      return ambulancias;
    }).catch(error => {
      console.error('Error al listar ambulancias:', error);
      throw error;
    });
  }

  async obtenerAmbulanciaPorId(id: number): Promise<any> {
    const query = `
    SELECT ambulancia.*, estado.nombre AS estadoNombre
    FROM ambulancia
    INNER JOIN estado ON ambulancia.idestado = estado.idestado
    WHERE ambulancia.idambulancia = ?
  `;
    try {
      const res = await this.database.executeSql(query, [id]);
      if (res.rows.length > 0) {
        return res.rows.item(0);
      }
      return null;
    } catch (error) {
      console.error('Error al obtener la ambulancia:', error);
      throw error;
    }
  }


  async actualizarAmbulancia(id: number, patente: string, equipada: boolean, fec_mant: string, idestado: number): Promise<void> {
    const query = `
    UPDATE ambulancia 
    SET patente = ?, equipada = ?, fec_mant = ?, idestado = ? 
    WHERE idambulancia = ?
  `;
    try {
      await this.database.executeSql(query, [patente, equipada ? 1 : 0, fec_mant, idestado, id]);
      console.log('Ambulancia actualizada correctamente');
    } catch (error) {
      console.error('Error al actualizar la ambulancia:', error);
      throw error;
    }
  }

  async verificarAmbulanciaPorPatente(patente: string): Promise<boolean> {
    const query = `SELECT COUNT(*) AS count FROM ambulancia WHERE patente = ?`;
    try {
      const result = await this.database.executeSql(query, [patente]);
      const count = result.rows.item(0).count;
      return count > 0;
    } catch (error) {
      console.error('Error al verificar la existencia de la patente:', error);
      throw error;
    }
  }


  async obtenerAmbulanciaPorPatente(patente: string): Promise<any> {
    const query = `SELECT * FROM ambulancia WHERE patente = ?`;
    try {
      const res = await this.database.executeSql(query, [patente]);
      if (res.rows.length > 0) {
        return res.rows.item(0);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error al obtener la ambulancia por patente:', error);
      throw error;
    }
  }

  async obtenerMedicoPorRut(rut: string): Promise<any> {
    const query = `SELECT idPersona FROM persona WHERE rut = ?`;
    const res = await this.database.executeSql(query, [rut]);
    return res.rows.length > 0 ? res.rows.item(0) : null;
  }


  async obtenerEmergenciaPorId(idEmergencia: number): Promise<any> {
    const query = `SELECT motivo, observaciones FROM emergencia WHERE idEmerg = ?`;
    const res = await this.database.executeSql(query, [idEmergencia]);
    return res.rows.length > 0 ? res.rows.item(0) : null;
  }

  async obtenerMensajeHospitalPorEmergencia(idEmergencia: number): Promise<string> {
    // Ejemplo de mensaje predefinido. Modifica según tu lógica
    const query = `SELECT mensaje FROM hospital_mensajes WHERE idEmerg = ?`;
    const res = await this.database.executeSql(query, [idEmergencia]);
    return res.rows.length > 0 ? res.rows.item(0).mensaje : 'Sin mensaje disponible';
  }





}




