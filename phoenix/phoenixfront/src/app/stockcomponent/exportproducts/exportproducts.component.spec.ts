import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportproductsComponent } from './exportproducts.component';

describe('ExportproductsComponent', () => {
  let component: ExportproductsComponent;
  let fixture: ComponentFixture<ExportproductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportproductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
