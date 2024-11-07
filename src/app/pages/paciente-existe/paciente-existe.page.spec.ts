import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PacienteExistePage } from './paciente-existe.page';

describe('PacienteExistePage', () => {
  let component: PacienteExistePage;
  let fixture: ComponentFixture<PacienteExistePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PacienteExistePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
