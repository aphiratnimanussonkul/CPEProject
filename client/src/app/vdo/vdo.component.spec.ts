import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VdoComponent } from './vdo.component';

describe('VdoComponent', () => {
  let component: VdoComponent;
  let fixture: ComponentFixture<VdoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VdoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VdoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
