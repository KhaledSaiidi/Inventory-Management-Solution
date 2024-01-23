import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateprodComponent } from './updateprod.component';

describe('UpdateprodComponent', () => {
  let component: UpdateprodComponent;
  let fixture: ComponentFixture<UpdateprodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateprodComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateprodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
