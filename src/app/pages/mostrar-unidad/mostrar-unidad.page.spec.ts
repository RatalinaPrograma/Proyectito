import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MostrarUnidadPage } from './mostrar-unidad.page';

describe('MostrarUnidadPage', () => {
  let component: MostrarUnidadPage;
  let fixture: ComponentFixture<MostrarUnidadPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MostrarUnidadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
