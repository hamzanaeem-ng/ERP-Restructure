import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconDrawerComponent } from './icon-drawer.component';

describe('IconDrawerComponent', () => {
  let component: IconDrawerComponent;
  let fixture: ComponentFixture<IconDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
