import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfRecepPage } from './conf-recep.page';

describe('ConfRecepPage', () => {
  let component: ConfRecepPage;
  let fixture: ComponentFixture<ConfRecepPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfRecepPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
