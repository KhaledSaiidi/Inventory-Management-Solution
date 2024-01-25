import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckprodsComponent } from './checkprods.component';

describe('CheckprodsComponent', () => {
  let component: CheckprodsComponent;
  let fixture: ComponentFixture<CheckprodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckprodsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckprodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
