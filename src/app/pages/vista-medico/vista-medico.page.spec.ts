import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VistaMedicoPage } from './vista-medico.page';

describe('VistaMedicoPage', () => {
  let component: VistaMedicoPage;
  let fixture: ComponentFixture<VistaMedicoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaMedicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
