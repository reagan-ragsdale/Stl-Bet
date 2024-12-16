import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropScreenNewComponent } from './prop-screen-new.component';

describe('PropScreenNewComponent', () => {
  let component: PropScreenNewComponent;
  let fixture: ComponentFixture<PropScreenNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PropScreenNewComponent]
    });
    fixture = TestBed.createComponent(PropScreenNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
