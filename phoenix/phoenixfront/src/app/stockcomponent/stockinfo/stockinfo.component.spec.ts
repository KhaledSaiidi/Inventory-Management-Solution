import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockinfoComponent } from './stockinfo.component';

describe('StockinfoComponent', () => {
  let component: StockinfoComponent;
  let fixture: ComponentFixture<StockinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockinfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
