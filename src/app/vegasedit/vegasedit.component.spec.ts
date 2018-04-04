import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VegaseditComponent } from './vegasedit.component';

describe('VegaseditComponent', () => {
  let component: VegaseditComponent;
  let fixture: ComponentFixture<VegaseditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VegaseditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VegaseditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
