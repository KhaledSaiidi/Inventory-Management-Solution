import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenscanComponent } from './openscan.component';

describe('OpenscanComponent', () => {
  let component: OpenscanComponent;
  let fixture: ComponentFixture<OpenscanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenscanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenscanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
