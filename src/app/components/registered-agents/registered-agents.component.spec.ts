import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredAgentsComponent } from './registered-agents.component';

describe('RegisteredAgentsComponent', () => {
  let component: RegisteredAgentsComponent;
  let fixture: ComponentFixture<RegisteredAgentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisteredAgentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisteredAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});