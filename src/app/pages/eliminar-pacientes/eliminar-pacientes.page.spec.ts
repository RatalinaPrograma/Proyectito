import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EliminarPacientesPage } from './eliminar-pacientes.page';
import { ServiciobdService } from '../services/serviciobd.service';
import { Router } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('EliminarPacientesPage', () => {
  let component: EliminarPacientesPage;
  let fixture: ComponentFixture<EliminarPacientesPage>;
  let serviciobdServiceMock: jasmine.SpyObj<ServiciobdService>;
  let routerMock: jasmine.SpyObj<Router>;
  let sqliteMock: any; // Mock manual para SQLite
  let navControllerMock: jasmine.SpyObj<NavController>;

  beforeEach(async () => {
    serviciobdServiceMock = jasmine.createSpyObj('ServiciobdService', ['eliminarPaciente']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    sqliteMock = jasmine.createSpyObj('SQLite', ['create']);
    navControllerMock = jasmine.createSpyObj('NavController', ['navigateForward']);

    await TestBed.configureTestingModule({
      declarations: [EliminarPacientesPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServiciobdService, useValue: serviciobdServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: SQLite, useValue: sqliteMock },
        { provide: NavController, useValue: navControllerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EliminarPacientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
