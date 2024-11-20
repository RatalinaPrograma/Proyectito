import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CambioClavePage } from './cambio-clave.page';
import { ServiciobdService } from '../services/serviciobd.service';
import { AlertasService } from '../services/alertas.service';
import { Router } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('CambioClavePage', () => {
  let component: CambioClavePage;
  let fixture: ComponentFixture<CambioClavePage>;
  let serviciobdServiceMock: jasmine.SpyObj<ServiciobdService>;
  let alertasServiceMock: jasmine.SpyObj<AlertasService>;
  let routerMock: jasmine.SpyObj<Router>;
  let navControllerMock: jasmine.SpyObj<NavController>;
  let sqliteMock: any;

  beforeEach(async () => {
    serviciobdServiceMock = jasmine.createSpyObj('ServiciobdService', ['obtenerUsuario', 'modificarPersona']);
    alertasServiceMock = jasmine.createSpyObj('AlertasService', ['presentAlert']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    navControllerMock = jasmine.createSpyObj('NavController', ['navigateRoot']); // Mock para NavController

    sqliteMock = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve()),
    };

    await TestBed.configureTestingModule({
      declarations: [CambioClavePage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServiciobdService, useValue: serviciobdServiceMock },
        { provide: AlertasService, useValue: alertasServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: SQLite, useValue: sqliteMock },
        { provide: NavController, useValue: navControllerMock }, // Mock para NavController
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CambioClavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
