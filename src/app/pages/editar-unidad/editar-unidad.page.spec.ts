import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarUnidadPage } from './editar-unidad.page';

describe('EditarUnidadPage', () => {
  let component: EditarUnidadPage;
  let fixture: ComponentFixture<EditarUnidadPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarUnidadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
