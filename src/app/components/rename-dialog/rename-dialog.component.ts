import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { Document } from './../../models/document';
import { DocumentService } from './../../services/document.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog-body',
  templateUrl: './rename-dialog.component.html',
  styleUrls: ['./rename-dialog.component.css']
})
export class RenameDialogComponent implements OnInit {
  private subscriptions: Subscription = new Subscription();
  doc: Document = { 
    _id: '',
    title: '',
    body: '',
    starred: undefined,
  }
  renameDocForm: FormGroup;

  // If User presses 'Enter' key to submit. Weird bug with ngSubmit not working sometimes on 'Enter' key. This seems to remove inconsistencies.
  @HostListener('document:keyup', ['$event']) onKeyUp(e:KeyboardEvent) {
    if (e.keyCode === 13) {
      e.preventDefault();
      document.getElementById('rename').click();
    }
  }

  constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<RenameDialogComponent>, @Inject(MAT_DIALOG_DATA) data, private documentService: DocumentService) { 
  	this.doc = data;
  }

  ngOnInit() {
  	this.createRenameDocForm();
  }

  // Use FormBuilder to create the rename document form.
  createRenameDocForm() {
	this.renameDocForm = this.fb.group({
			title: [this.doc['title']]
		});
  }

  // Close the Modal
  close() {
  	this.dialogRef.close();
  }

  // Rename the document.
  rename() {
  	let newDoc = this.renameDocForm.value;
  	this.subscriptions.add(
  		this.documentService.renameDoc(this.doc['_id'], newDoc).subscribe((res) => {
  			// (res)ponse is the newly renamed document.
				this.dialogRef.close(res);
  		}, (err) => {
  			console.log(err);
  		})
		);
  }
}
