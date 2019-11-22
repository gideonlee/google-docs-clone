import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevertRenameDialogComponent } from './revert-rename-dialog.component';

describe('RevertRenameDialogComponent', () => {
  let component: RevertRenameDialogComponent;
  let fixture: ComponentFixture<RevertRenameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevertRenameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevertRenameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
