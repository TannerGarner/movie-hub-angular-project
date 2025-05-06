import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HasWatchedComponent } from './has-watched.component';

describe('HasWatchedComponent', () => {
  let component: HasWatchedComponent;
  let fixture: ComponentFixture<HasWatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HasWatchedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HasWatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
