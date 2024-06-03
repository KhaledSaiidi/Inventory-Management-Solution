import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellprodComponent } from './sellprod.component';

describe('SellprodComponent', () => {
  let component: SellprodComponent;
  let fixture: ComponentFixture<SellprodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellprodComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellprodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
