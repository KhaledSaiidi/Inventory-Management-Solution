import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdarchivedComponent } from './prodarchived.component';

describe('ProdarchivedComponent', () => {
  let component: ProdarchivedComponent;
  let fixture: ComponentFixture<ProdarchivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdarchivedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdarchivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
