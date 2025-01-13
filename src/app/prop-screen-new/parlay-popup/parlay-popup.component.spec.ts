import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParlayPopupComponent } from './parlay-popup.component';

describe('ParlayPopupComponent', () => {
  let component: ParlayPopupComponent;
  let fixture: ComponentFixture<ParlayPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParlayPopupComponent]
    });
    fixture = TestBed.createComponent(ParlayPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
