import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, AlertController } from '@ionic/angular';
import { ModificarSignosVitalesComponent } from './modificar-signos-vitales.component';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ServiciobdService } from '../services/serviciobd.service';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

describe('ModificarSignosVitalesComponent', () => {
  let component: ModificarSignosVitalesComponent;
  let fixture: ComponentFixture<ModificarSignosVitalesComponent>;
  let serviciobdServiceMock: jasmine.SpyObj<ServiciobdService>;
  let alertControllerMock: any;
  let locationMock: jasmine.SpyObj<Location>;
  let activatedRouteMock: any;
  let sqliteMock: jasmine.SpyObj<SQLite>;

  beforeEach(waitForAsync(() => {
    serviciobdServiceMock = jasmine.createSpyObj('ServiciobdService', [
      'consultartablaSignosVitalesPorRutPaciente',
      'modificarSignosVitales',
      'eliminarSignosVitales',
    ]);

    alertControllerMock = {
      create: jasmine.createSpy('create').and.returnValue(
        Promise.resolve({
          present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
        })
      ),
    };

    locationMock = jasmine.createSpyObj('Location', ['back']);
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('12345678-9'), // Mock del RUT
        },
      },
    };

    sqliteMock = jasmine.createSpyObj('SQLite', {
      create: Promise.resolve(new SQLiteObject({} as any)),
    });

    TestBed.configureTestingModule({
      declarations: [ModificarSignosVitalesComponent],
      imports: [
        IonicModule.forRoot(),
        FormsModule, // Agregado para soporte de ngForm
      ],
      providers: [
        { provide: ServiciobdService, useValue: serviciobdServiceMock },
        { provide: AlertController, useValue: alertControllerMock },
        { provide: Location, useValue: locationMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: SQLite, useValue: sqliteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarSignosVitalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
