import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestockingComponent } from './restocking.component';

describe('RestockingComponent', () => {
  let component: RestockingComponent;
  let fixture: ComponentFixture<RestockingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestockingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestockingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
