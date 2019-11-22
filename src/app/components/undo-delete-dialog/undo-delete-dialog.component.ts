import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-undo-delete-dialog',
  templateUrl: './undo-delete-dialog.component.html',
  styleUrls: ['./undo-delete-dialog.component.css']
})
export class UndoDeleteDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UndoDeleteDialogComponent>, private dialog: MatDialog) { }

  ngOnInit() {
  }

  undoDelete() {
  	this.dialogRef.close({ confirm: false });
  }
}
