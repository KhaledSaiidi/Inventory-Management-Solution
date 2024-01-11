import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCampaignComponent } from './update-campaign.component';

describe('UpdateCampaignComponent', () => {
  let component: UpdateCampaignComponent;
  let fixture: ComponentFixture<UpdateCampaignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCampaignComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
