import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyusComponent } from './whyus.component';

describe('WhyusComponent', () => {
  let component: WhyusComponent;
  let fixture: ComponentFixture<WhyusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhyusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
