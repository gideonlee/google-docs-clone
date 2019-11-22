import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UndoRenameDialogComponent } from './undo-rename-dialog.component';

describe('UndoDialogComponent', () => {
  let component: UndoRenameDialogComponent;
  let fixture: ComponentFixture<UndoRenameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UndoRenameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UndoRenameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
