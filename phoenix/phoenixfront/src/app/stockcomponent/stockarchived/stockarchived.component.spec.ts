import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockarchivedComponent } from './stockarchived.component';

describe('StockarchivedComponent', () => {
  let component: StockarchivedComponent;
  let fixture: ComponentFixture<StockarchivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockarchivedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockarchivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
