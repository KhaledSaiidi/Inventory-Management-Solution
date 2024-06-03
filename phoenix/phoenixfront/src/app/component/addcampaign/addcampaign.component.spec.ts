import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcampaignComponent } from './addcampaign.component';

describe('AddcampaignComponent', () => {
  let component: AddcampaignComponent;
  let fixture: ComponentFixture<AddcampaignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddcampaignComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddcampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
