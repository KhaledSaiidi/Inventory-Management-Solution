import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignproductsComponent } from './assignproducts.component';

describe('AssignproductsComponent', () => {
  let component: AssignproductsComponent;
  let fixture: ComponentFixture<AssignproductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignproductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
