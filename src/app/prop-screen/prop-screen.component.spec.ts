import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropScreenComponent } from './prop-screen.component';

describe('PropScreenComponent', () => {
  let component: PropScreenComponent;
  let fixture: ComponentFixture<PropScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PropScreenComponent]
    });
    fixture = TestBed.createComponent(PropScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
