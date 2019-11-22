import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material';
import { RevertRenameDialogComponent } from './../revert-rename-dialog/revert-rename-dialog.component';
import { Document } from './../../models/document';

@Component({
  selector: 'app-undo-dialog',
  templateUrl: './undo-rename-dialog.component.html',
  styleUrls: ['./undo-rename-dialog.component.css']
})
export class UndoRenameDialogComponent implements OnInit {
  oldDoc: Document = {
    _id: '',
    title: '',
    body: '',
    starred: undefined,
  };

  constructor(public dialogRef: MatDialogRef<UndoRenameDialogComponent>, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) data) { 
  	this.oldDoc = data;
  }

  ngOnInit() {
  }

  // Undo/revert the renamed document.
  undoRename() {
  	// Pass old title back.
  	this.dialogRef.close(this.oldDoc);

  	const revertDialogConfig = new MatDialogConfig();
  	revertDialogConfig.hasBackdrop = false;
  	revertDialogConfig.autoFocus = false;
  	revertDialogConfig.position = { 'bottom': '20px', 'left': '20px' };
  	revertDialogConfig.panelClass = ['custom-undo-rename-container'];

  	// New Modal indicating the document has been reverted.
  	let revertDialogRef = this.dialog.open(RevertRenameDialogComponent, revertDialogConfig);

  	setTimeout(function() {
  		revertDialogRef.close();
  	}, 4000);
  }
}
