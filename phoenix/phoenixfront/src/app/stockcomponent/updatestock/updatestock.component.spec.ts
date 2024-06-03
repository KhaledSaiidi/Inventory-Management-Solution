import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatestockComponent } from './updatestock.component';

describe('UpdatestockComponent', () => {
  let component: UpdatestockComponent;
  let fixture: ComponentFixture<UpdatestockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatestockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatestockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
