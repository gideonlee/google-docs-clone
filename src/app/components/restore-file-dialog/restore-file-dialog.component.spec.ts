import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoreFileDialogComponent } from './restore-file-dialog.component';

describe('RestoreFileDialogComponent', () => {
  let component: RestoreFileDialogComponent;
  let fixture: ComponentFixture<RestoreFileDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestoreFileDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestoreFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
