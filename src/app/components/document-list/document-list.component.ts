import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Document } from './../../models/document';
import { DocumentService } from './../../services/document.service';
import { RenameDialogComponent } from './../rename-dialog/rename-dialog.component';
import { UndoRenameDialogComponent } from './../undo-rename-dialog/undo-rename-dialog.component';
import { UndoDeleteDialogComponent } from './../undo-delete-dialog/undo-delete-dialog.component';
import { RestoreFileDialogComponent } from './../restore-file-dialog/restore-file-dialog.component';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
	private subscriptions: Subscription = new Subscription();
	documents: [];
  undoRenameDialogRef;
  restoreFileDialogRef;
  selectedDoc: Document = {
    _id: '',
    title: '',
    body: '',
    starred: undefined,
  }
  screenHeight: number;

  constructor(private documentService: DocumentService, private router: Router, private dialog: MatDialog) {
    this.onResize();
  }

  // Get Screen Size to see if options div needs to open on top or below the button.
  @HostListener('window:resize', ['$event']) onResize(event?) {
    this.screenHeight = window.innerHeight;
  }

  // HostListener to hide options container
  @HostListener('document:click', ['$event']) onClick(e) {
    this.hideOptions();
  }

  ngOnInit() {
  	this.getAllDocs();
  }
  
	// Get all the documents
  getAllDocs() {
  	this.subscriptions.add(
  		this.documentService.getAllDocs().subscribe((res) => {
  			this.documents = res;
  		}, (err) => {
  			console.log(`Subscription Error on getting all documents.`);
  		})
		);
  }

  // Hides the options div for each recent document.
  hideOptions() {
  	let docs = document.getElementsByClassName('rd');
  	for (let i = 0; i < docs.length; i++) {
  		docs[i].children[1].children[2]['style'].display = 'none';
  	}
  }

  // Opens up the selected document.
  openDoc(doc) {
    this.closeModals();
  	this.router.navigateByUrl(`/documents/${doc._id}`);
  }

  // Opens up Div to rename a document
  renameDoc(doc) {
    // Closes selected document's options menu 
  	let docs = document.getElementsByClassName('rd');
  	for (let i = 0; i < docs.length; i++) {
  		if (docs[i].getAttribute('data-id') == doc._id) {
  			docs[i].children[1].children[2]['style'].display = 'none';
  			break;
  		}
  	}

    // House Keeping to close to the existing undo/revert dialogs if it's opened.
    this.closeModals();

  	// Dialog Configuration
  	const renameDialogConfig = new MatDialogConfig();
  	renameDialogConfig.data = doc;
  	renameDialogConfig.autoFocus = true; 
  	renameDialogConfig.hasBackdrop = true;

  	// Reload the document title after it has been changed and initates the undo modal.
  	let renameDialogRef = this.dialog.open(RenameDialogComponent, renameDialogConfig);

		this.subscriptions.add(renameDialogRef.afterClosed().subscribe((renamedDoc) => {
			// If the document is renamed
			if (renamedDoc !== undefined) {
				if (renamedDoc.title !== doc.title) {
       		this.getAllDocs();

			 		// undoDialog allows User to undo the most recent change. Pass the old doc info into the new dialog in case they wish to undo this change. 
					const undoRenameDialogConfig = new MatDialogConfig();
          undoRenameDialogConfig.data = doc;
			  	undoRenameDialogConfig.hasBackdrop = false;
		  		undoRenameDialogConfig.autoFocus = false; 
		  		undoRenameDialogConfig.position = { 'bottom': '20px', 'left': '20px' };
					undoRenameDialogConfig.panelClass = ['custom-undo-rename-container'];
			  
					this.undoRenameDialogRef = this.dialog.open(UndoRenameDialogComponent, undoRenameDialogConfig);

					setTimeout(() => {
            if (this.undoRenameDialogRef !== undefined) {
              this.undoRenameDialogRef.close();
            }
					}, 7000);

          this.subscriptions.add(this.undoRenameDialogRef.afterClosed().subscribe((oldDoc) => {
            if (oldDoc !== undefined) {
              this.subscriptions.add(
                this.documentService.renameDoc(oldDoc._id, oldDoc).subscribe((res) => {
                  this.getAllDocs();
                })
              );
            }
          }))
          
				}
			}
		}));
  }

  // Removes Document
  removeDoc(id, i) {
    // Pseudo remove the doc. 
    this.documents.splice(i, 1);
    
    // Dialog Configurations
    const undoDeleteDialogConfig = new MatDialogConfig();
    undoDeleteDialogConfig.hasBackdrop = false;
    undoDeleteDialogConfig.autoFocus = false;
    undoDeleteDialogConfig.position = { 'bottom': '20px', 'left': '20px' }
    undoDeleteDialogConfig.panelClass = ['custom-undo-delete-container'];

    // Close existing modals before opening up the undo delete dialog.
    this.closeModals();

    let undoDeleteDialogRef = this.dialog.open(UndoDeleteDialogComponent, undoDeleteDialogConfig);
    
    setTimeout(() => {
      // Set the confirmation and truly remove doc.
      undoDeleteDialogRef.close({ confirm: true });
    }, 7000);
    	
    this.subscriptions.add(undoDeleteDialogRef.afterClosed().subscribe((res) => {
      if (res.confirm) {
        this.subscriptions.add(
      		this.documentService.removeDoc(id).subscribe((res) => {}, (err) => {
       			console.log(err);
      		})
    		);        
      } else {
        // Restore the removed doc.
        this.getAllDocs();

        // Dialog Configurations
        const restoreFileConfig = new MatDialogConfig();
        restoreFileConfig.hasBackdrop = false;
        restoreFileConfig.autoFocus = false;
        restoreFileConfig.position = { 'bottom': '20px', 'left': '20px' };
        restoreFileConfig.panelClass = ['custom-restore-delete-container'];

        this.restoreFileDialogRef = this.dialog.open(RestoreFileDialogComponent, restoreFileConfig);
        
        setTimeout(() => {
          this.restoreFileDialogRef.close();
        }, 3500);
      }
    }));
  }

  // Opens a document in a new tab.
  openInNewTab(id) {
  	window.open(`http://localhost:4200/documents/${id}`, `_blank`);
  	let docs = document.getElementsByClassName('rd');
  	for (let i = 0; i < docs.length; i++) {
  		if (docs[i].getAttribute('data-id') == id) {
  			docs[i].children[1].children[2]['style'].display = 'none';
  			break;
  		}
  	}
    this.closeModals();
  }

  // Close all open Modals if they are defined.  
  closeModals() {
    if (this.restoreFileDialogRef !== undefined) {
      this.restoreFileDialogRef.close();
    }
    if (this.undoRenameDialogRef !== undefined) {
      this.undoRenameDialogRef.close();
    }
  }

  // Open up the options (rename, remove, open in new tab) of the selected document
  openOptions(selectedDoc) {
    this.selectedDoc = selectedDoc;
  	let docs = document.getElementsByClassName('rd');
  	for (let i = 0; i < docs.length; i++) {
  		if (docs[i].getAttribute('data-id') == selectedDoc._id) {
        if (this.screenHeight < 863) {
          docs[i].children[1].children[2]['style'].marginTop = '-185px';
        } else {
          docs[i].children[1].children[2]['style'].marginTop = '0px';
        }
  			docs[i].children[1].children[2]['style'].display = 'block';
  		} else {
  			docs[i].children[1].children[2]['style'].display = 'none';
  		}
  	}
  }

	// Create a new document
  newBlankDocument() {
  	let obj = {
  		title: 'Untitled document'
  	}
  	this.subscriptions.add(
  		this.documentService.createDoc(obj).subscribe((res) => {
  			this.router.navigateByUrl(`/documents/${res._id}`);
  		}, (err) => {
  			console.log(`Subscription Error on creating blank document.`);
  		})
  	);
    this.closeModals();
  }

  ngOnDestroy() {
  	this.subscriptions.unsubscribe();
  }
}
