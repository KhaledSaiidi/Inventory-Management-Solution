import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigateprodsComponent } from './navigateprods.component';

describe('NavigateprodsComponent', () => {
  let component: NavigateprodsComponent;
  let fixture: ComponentFixture<NavigateprodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigateprodsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigateprodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
