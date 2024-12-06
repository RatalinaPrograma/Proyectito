import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialCasosPage } from './historial-casos.page';
import { IonicModule, NavController } from '@ionic/angular';
import { ServiciobdService } from '../services/serviciobd.service';
import { Router } from '@angular/router';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';

describe('HistorialCasosPage', () => {
  let component: HistorialCasosPage;
  let fixture: ComponentFixture<HistorialCasosPage>;

  let serviciobdServiceMock: jasmine.SpyObj<ServiciobdService>;
  let routerMock: jasmine.SpyObj<Router>;
  let fileMock: any;
  let fileOpenerMock: any;
  let navControllerMock: jasmine.SpyObj<NavController>;

  beforeEach(async () => {
    serviciobdServiceMock = jasmine.createSpyObj('ServiciobdService', ['obtenerDatosConNombrePaciente']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    navControllerMock = jasmine.createSpyObj('NavController', ['navigateBack', 'navigateForward']);

    fileMock = {
      writeFile: jasmine.createSpy('writeFile').and.returnValue(Promise.resolve()),
      dataDirectory: 'mock-directory/',
    };

    fileOpenerMock = {
      open: jasmine.createSpy('open').and.returnValue(Promise.resolve()),
    };

    await TestBed.configureTestingModule({
      declarations: [HistorialCasosPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServiciobdService, useValue: serviciobdServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: File, useValue: fileMock },
        { provide: FileOpener, useValue: fileOpenerMock },
        { provide: NavController, useValue: navControllerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HistorialCasosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
