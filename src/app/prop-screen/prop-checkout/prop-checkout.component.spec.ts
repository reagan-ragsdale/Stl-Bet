import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropCheckoutComponent } from './prop-checkout.component';

describe('PropCheckoutComponent', () => {
  let component: PropCheckoutComponent;
  let fixture: ComponentFixture<PropCheckoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PropCheckoutComponent]
    });
    fixture = TestBed.createComponent(PropCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
