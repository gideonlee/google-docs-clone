import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UndoDeleteDialogComponent } from './undo-delete-dialog.component';

describe('UndoDeleteDialogComponent', () => {
  let component: UndoDeleteDialogComponent;
  let fixture: ComponentFixture<UndoDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UndoDeleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UndoDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
