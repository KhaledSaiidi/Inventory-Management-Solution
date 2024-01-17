import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddstockComponent } from './addstock.component';

describe('AddstockComponent', () => {
  let component: AddstockComponent;
  let fixture: ComponentFixture<AddstockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddstockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddstockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
