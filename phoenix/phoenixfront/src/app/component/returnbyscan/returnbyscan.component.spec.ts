import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnbyscanComponent } from './returnbyscan.component';

describe('ReturnbyscanComponent', () => {
  let component: ReturnbyscanComponent;
  let fixture: ComponentFixture<ReturnbyscanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnbyscanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnbyscanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
