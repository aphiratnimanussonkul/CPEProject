import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MycourseComponent } from './mycourse.component';

describe('MycourseComponent', () => {
  let component: MycourseComponent;
  let fixture: ComponentFixture<MycourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MycourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MycourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
