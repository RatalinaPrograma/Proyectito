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
      this.sqlite.create({
        name: 'pulseTrack.db',
        location: 'default'
      }).then(async (db: SQLiteObject) => {
        this.database = db;
        this.crearTablas();
        // await db.executeSql('DROP TABLE IF EXISTS persona;', []);
        // await db.executeSql('DROP TABLE IF EXISTS paciente;', []);
        // await this.database.executeSql('DROP TABLE IF EXISTS emergencia', []);
        // await this.database.executeSql(this.tablaEmergencia, []);
        await this.insertarEstadosIniciales();
        this.isDBReady.next(true);
        this.dbIsCreated = true;
        this.insertarUsuarioPredeterminado();
      }).catch(e => {
        console.error('Error al crear la BD', e);
        this.presentAlert('Creación de BD', 'Error creando la BD: ' + JSON.stringify(e));
      });

    });

  }

  crearTablas() {
    let tablas = [
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

    tablas.forEach(tabla => {
      this.database.executeSql(tabla, [])
        .then(() => console.log('Tabla creada correctamente'))
        .catch(e => this.presentAlert('Error creando tablas', 'Error: ' + JSON.stringify(e)));
    });
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
  ): Promise<any> {
    return this.verificarPaciente(rut).then(existe => {
      if (existe) {
        // Si el paciente ya existe, mostramos una alerta
        console.log(
          "Agregar paciente",
          "El paciente con ese RUT ya está registrado."
        );
        return Promise.reject(new Error('Paciente ya registrado'));
      }

      // Si no existe, lo agregamos a la base de datos
      const query = `INSERT INTO paciente (nombre, f_nacimiento, idGenero, rut, telefono_contacto) VALUES (?, ?, ?, ?, ?)`;
      return this.database.executeSql(query, [nombre, f_nacimiento, idGenero, rut, telefono_contacto])
        .then(res => {
          this.AlertasService.presentAlert(
            "Agregar paciente",
            "Paciente agregado correctamente."
          );
          return { message: 'Paciente agregado', changes: res.rowsAffected };
        });
    }).catch(err => {
      // Captura cualquier error que ocurra en el proceso
      this.AlertasService.presentAlert(
        "Agregar paciente",
        "Ocurrió un error: " + err.message
      );
      return Promise.reject(new Error(`Error al agregar el paciente: ${err.message}`));
    });
  }


  consultartablaPaciente(): Promise<Pacientes[]> {
    return this.database.executeSql('SELECT * FROM paciente', []).then(res => {
      let itemsR: Pacientes[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          itemsR.push({
            idPaciente: res.rows.item(i).idPaciente,
            nombre: res.rows.item(i).nombre,
            f_nacimiento: res.rows.item(i).f_nacimiento,
            idGenero: res.rows.item(i).idGenero,
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


  async register(persona: any): Promise<boolean> {
    // Verifica los datos antes de intentar el registro
    if (!this.validarDatos(persona)) {
      this.AlertasService.presentAlert('Error en registro', 'Datos incompletos o inválidos');
      return false;
    }

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
      console.error('Error al registrar usuario', error);

      // Manejo de errores específicos
      if ((error as any).code === 'SQLITE_CONSTRAINT') {
        this.AlertasService.presentAlert('Error en registro', 'El RUT o correo ya están registrados.');
      } else {
        this.AlertasService.presentAlert('Error en registro', 'El registro falló. Verifique los datos');
      }

      return false;
    }
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
  async login(rut: string, password: string): Promise<any> {
    if (!rut || !password) {
      this.AlertasService.presentAlert('Error', 'RUT y contraseña son obligatorios');
      return;
    }

    const query = `SELECT * FROM persona WHERE rut = ? AND clave = ?`;
    try {
      // Imprime los valores de rut y password para verificar
      console.log(`Intentando login con RUT: ${rut.trim()} y contraseña: ${password}`);

      const res = await this.database.executeSql(query, [rut.trim(), password]);

      // Verifica si la consulta SQL devuelve algún resultado
      console.log(`Resultado de la consulta de login:`, res.rows);

      if (res.rows.length > 0) {
        console.log('Usuario encontrado:', res.rows.item(0)); // Usuario encontrado, imprime los datos
        return res.rows.item(0); // Retorna el usuario encontrado
      } else {
        console.log('Usuario no encontrado: RUT o contraseña incorrectos');
        return null;
      }
    } catch (error) {
      console.error('Error durante el login', error);
      this.AlertasService.presentAlert('Error', 'No se pudo iniciar sesión. Inténtelo más tarde');
      return;
    }
  }



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
      let usuarios: any[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        usuarios.push(res.rows.item(i));
      }
      console.log('Usuarios encontrados:', usuarios); // Depuración
      return usuarios;
    } catch (error) {
      console.error('Error al listar usuarios:', error);
      throw error;
    }
  }


  async insertarUsuarioPredeterminado() {
    const valores = ['Catalina', 'Gutiérrez', 'ADMIN@ADMIN.CL', 'Admin.123', '+56994125336', null, 1, '21273766-6'];
    try {
      const existe = await this.verificarUsuario('21273766-6');
      let sql = '';

      if (existe) {
        sql = `
          UPDATE persona SET nombres = ?, apellidos = ?, correo = ?, clave = ?, telefono = ?, foto = ?, idRol = ? WHERE rut = ?`;
      } else {
        sql = `
          INSERT INTO persona (nombres, apellidos, correo, clave, telefono, foto, idRol, rut) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      }

      // Ejecuta la consulta SQL con this.database.executeSql
      await this.database.executeSql(sql, valores);

    } catch (error) {
      alert('Error al insertar usuario predeterminado:' + error);
      throw error;
    }
  }

  // Verificar si un usuario existe por RUT
  private async verificarUsuario(rut: string): Promise<boolean> {
    const query = 'SELECT COUNT(1) as count FROM persona WHERE rut = ?';
    try {
      const res = await this.database.executeSql(query, [rut]);
      return res.rows.item(0).count > 0;
    } catch (error) {
      console.error('Error al verificar usuario', error);
      throw new Error('No se pudo verificar el usuario');
    }
  }

  public async convertirBlobABase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = (error) => {
        console.error('Error al convertir BLOB a Base64:', error);
        reject(error);
      };
    });
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




  async guardarConfirmacion(confirmacion: Confirmacion): Promise<void> {
    const query = `
      INSERT INTO confirmacion (idEmerg, idPersona, fecha_confirmacion, estado_confirmacion) 
      VALUES (?, ?, ?, ?)
    `;

    try {
      await this.database.executeSql(query, [
        confirmacion.idEmerg,
        confirmacion.idPersona,
        new Date().toISOString(), // fecha_confirmacion
        confirmacion.estado_confirmacion
      ]);
      console.log('Confirmación guardada correctamente');
    } catch (error) {
      console.error('Error al guardar la confirmación:', error);
      throw error;
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
    SELECT e.*, p.nombre AS nombrePaciente
    FROM emergencia e
    INNER JOIN paciente p ON e.idPaciente = p.idPaciente
    WHERE e.estado = 'activo' 
    ORDER BY e.fecha_emer DESC 
    LIMIT 2
  `;
    try {
      const resultado = await this.database.executeSql(query, []);
      const emergencias = [];
      for (let i = 0; i < resultado.rows.length; i++) {
        emergencias.push(resultado.rows.item(i));
      }
      console.log('Emergencias activas obtenidas:', emergencias);
      return emergencias;
    } catch (error) {
      console.error('Error al obtener emergencias activas:', error);
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
    const fechaEmergencia = new Date().toISOString();
    const estado = 'activo';

    const query = `
    INSERT INTO emergencia (fecha_emer, motivo, desc_motivo, observaciones, estado, idPaciente)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

    try {
      await this.database.executeSql(query, [fechaEmergencia, motivo, descripcionMotivo, notas, estado, idPaciente]);
      console.log('Emergencia guardada correctamente');
    } catch (error) {
      console.error('Error al guardar la emergencia en la base de datos:', error);
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

}




