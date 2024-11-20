import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnvioInfoPage } from './envio-info.page';
import { ServiciobdService } from '../services/serviciobd.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('EnvioInfoPage', () => {
  let component: EnvioInfoPage;
  let fixture: ComponentFixture<EnvioInfoPage>;
  let serviciobdServiceMock: jasmine.SpyObj<ServiciobdService>;
  let routerMock: jasmine.SpyObj<Router>;
  let activatedRouteMock: any;
  let sqliteMock: any; // Mock manual para SQLite

  beforeEach(async () => {
    serviciobdServiceMock = jasmine.createSpyObj('ServiciobdService', ['obtenerPaciente']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    sqliteMock = jasmine.createSpyObj('SQLite', ['create']);
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('12345678-9'), // Mock del parámetro 'rut'
        },
      },
    };

    await TestBed.configureTestingModule({
      declarations: [EnvioInfoPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServiciobdService, useValue: serviciobdServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: SQLite, useValue: sqliteMock }, // Mock para SQLite
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EnvioInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
