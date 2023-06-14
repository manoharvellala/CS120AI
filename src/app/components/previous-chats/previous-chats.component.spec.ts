import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousChatsComponent } from './previous-chats.component';

describe('PreviousChatsComponent', () => {
  let component: PreviousChatsComponent;
  let fixture: ComponentFixture<PreviousChatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviousChatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviousChatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
