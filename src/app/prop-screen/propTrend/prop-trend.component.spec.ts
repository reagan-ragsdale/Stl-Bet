import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropTrendComponent } from './prop-trend.component';

describe('PropTrendComponent', () => {
  let component: PropTrendComponent;
  let fixture: ComponentFixture<PropTrendComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PropTrendComponent]
    });
    fixture = TestBed.createComponent(PropTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
