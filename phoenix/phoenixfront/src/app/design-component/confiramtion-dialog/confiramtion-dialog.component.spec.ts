import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiramtionDialogComponent } from './confiramtion-dialog.component';

describe('ConfiramtionDialogComponent', () => {
  let component: ConfiramtionDialogComponent;
  let fixture: ComponentFixture<ConfiramtionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfiramtionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiramtionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
