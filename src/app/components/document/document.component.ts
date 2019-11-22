import { Component, OnInit, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Document } from './../../models/document';
import { DocumentService } from './../../services/document.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {
	private subscriptions: Subscription = new Subscription();
	doc: Document = {
    _id: '',
    title: '',
    body: '',
    starred: false,
  }
  imgSrc: String = 'assets/icons/star-icon.png';
  undoSrc: String = 'assets/icons/undo-icon.png';
  redoSrc: String = 'assets/icons/redo-icon.png';
  printerSrc: String = 'assets/icons/printer-icon.png';
  spellcheckSrc: String = 'assets/icons/spellcheck-icon.png';
  paintFormatSrc: String = 'assets/icons/paint-format-icon.png';
  boldSrc: String = 'assets/icons/bold-icon.png';
  italicSrc: String = 'assets/icons/italic-icon.png';
  underlineSrc: String = 'assets/icons/underline-icon.png';
  textColorSrc: String = 'assets/icons/text-color-icon.png';
  highlightSrc: String = 'assets/icons/highlight-icon.png';

  renameFocus: boolean = false; // If rename is focused, the 'Enter' key is used to submit the rename function.
  documentFocus: boolean = false; // If document is focused, look for changes/pauses to save the document.

  typingTimer; // Set Timeout function 
  finishedTypingInterval: number = 1000; // Timer that triggers every 1000 ms. 

  // Checks if 'Enter' key is pressed on Rename Form, prevent the div from expanding. Keydown happens before key is registered as opposed to Keyup where function is performed afterwards.
  // Checks if 'Tab' key is pressed on Document Form, prevent unfocuses the div. 
  @HostListener('document:keydown', ['$event']) onKeyDown(e:KeyboardEvent) {
    // 'Enter' Key is pressed on Rename.
    if (this.renameFocus && e.keyCode === 13) {
      this.submitRenameForm(e);
    }

    // 'Tab' Key is pressed on Document.
    if (this.documentFocus && e.keyCode === 9) {
      this.insertTabToDoc(e);
    }
    
    // 'Enter' Key is pressed in Document. Keep tracking for multiple spacing.
    if (this.documentFocus && e.keyCode === 13) {
      this.insertNewLineToDoc(e);
    }

    // When User is typing in the Document, clear the typingTimer timer. 
    if (this.documentFocus && document.getElementById('document') !== null) {
      clearTimeout(this.typingTimer);
    }
  }

  @HostListener('document:keyup', ['$event']) onKeyUp(e:KeyboardEvent) { 
    // When User has just stopped typing (keyup registered) in the Document, clear the typingTimer and set it to perform the updateDoc function after the finishedTypingInterval has been reached. 
    // Arrow function is used instead of a callback function because the concept of 'this' will get lost.
    if (this.documentFocus && document.getElementById('document') !== null) {
      clearTimeout(this.typingTimer);
      this.typingTimer = setTimeout(() => {
        this.updateDoc();
      }, this.finishedTypingInterval);
    }
  }

  constructor(private documentService: DocumentService, private ar: ActivatedRoute, private socket: Socket) { 
    // If this.doc is current doc, update the title. 
    this.socket.on('updateTitle', (doc) => {
      if (this.doc._id === doc._id) {
        this.doc.title = doc.title;
      }
    });

    // If this.doc is current doc, update the body. 
    this.socket.on('updateClientDocument', (doc) => {
      if (this.doc._id === doc._id) {
        let element = document.getElementById('document');
        let od = element.ownerDocument;
        let win = od.defaultView;
        let sel = win.getSelection(); // Selection range represents where the user has selected
        let range = win.getSelection().getRangeAt(0); // The range of the object.
        let start = 0;
        let end = 0;

        let preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.startContainer, range.startOffset);
        start = preCaretRange.toString().length;
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        end = preCaretRange.toString().length;

        // Updates the doc.body.
        this.doc.body = doc.body;
        document.getElementById('document').innerHTML = doc.body;

        // Sets the cursor to where the User previously had it. 
        range.setStart(element.childNodes[0], start);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      } 
    })
  }

  // Updates Document changes on server side.
  updateDoc() {
    let doc = this.doc;
    doc.body = document.getElementById('document').innerHTML;

    this.documentService.updateDoc(this.doc._id, doc).subscribe((res) => {
      if (doc._id == this.doc._id) {
        this.socket.emit('changesToServerDocument', res);
      }
     }, (err) => {
      console.log('Error on update');
    })
  }
  
  ngOnInit() {
    let id = this.ar.snapshot.params.id;
    this.getDoc(id);
  }

  // Get Document by _id
  getDoc(id) {
    this.subscriptions.add(
      this.documentService.findDoc(id).subscribe((res) => {
        this.doc = res;
        if (this.doc.body === undefined) {
          this.doc.body = ''; 
        }
        document.getElementById('document').innerHTML = this.doc.body;

        if (this.doc.starred) {
          this.imgSrc = 'assets/icons/star-icon-checked.png';
        } else {
          this.imgSrc = 'assets/icons/star-icon.png';
        }
      }, (err) => {
        console.log(`Error on subscription side.`);
      })
    );
  }

  // When User focuses the rename form, change focus to true so that when User presses 'Enter', it will confirm rename of the form. If doc.title is 'Untitled document', highlight all of the input upon rename for ease access. 
  renameFormFocused() {
    this.renameFocus = true;
    document.getElementById('rename')['style'].color = '#1B0F07';
    if (this.doc.title == 'Untitled document') {
      window.getSelection().selectAllChildren(document.getElementById('rename'));
    }
  }

  // Rename the Document. If it is empty, name it 'Untitled document'.
  rename() {
    let doc = this.doc;
    doc.title = document.getElementById('rename').textContent;
    
    // Renames it 'Untitled document' if blank.
    if (document.getElementById('rename').textContent == '') {
      doc.title = 'Untitled document';
      document.getElementById('rename').textContent = 'Untitled document';
    }

    // If title is 'Untitled document', change the color of the font to grey'.
    if (doc.title == 'Untitled document') {
      document.getElementById('rename')['style'].color = '#777777'
    } else {
      document.getElementById('rename')['style'].color = '#1B0F07'
    }
    this.subscriptions.add(
      this.documentService.renameDoc(this.doc['_id'], doc).subscribe((res) => {
        this.doc = res;
        this.socket.emit('renameTitle', res);
      })
    )
  }

  // User submits rename form with 'Enter' key
  submitRenameForm(e) {
    e.preventDefault();
    this.renameFocus = false; 
    document.getElementById('document').focus();
    this.documentFocus = true; 
  }

  // User presses 'Enter' Key in document.
  insertNewLineToDoc(e) {
    e.preventDefault();
    let element = document.getElementById('document');    
    let doc = element.ownerDocument;
    let win = doc.defaultView; 
    let start = 0;
    let end = 0; 

    let sel = win.getSelection(); // Selection range represents where the user has selected
    let range = win.getSelection().getRangeAt(0); // The range of the object.

    let preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.startContainer, range.startOffset);
    start = preCaretRange.toString().length;
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    end = preCaretRange.toString().length;

    element.innerHTML = element.textContent.substr(0, start) + '\n' + element.textContent.substr(end);
    range.setStart(element.childNodes[0], start+1);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  // User presses 'Tab' Key in document.
  insertTabToDoc(e) {
    e.preventDefault();
    let element = document.getElementById('document');    
    let doc = element.ownerDocument;
    let win = doc.defaultView; 
    let start = 0;
    let end = 0; 

    let sel = win.getSelection(); // Selection range represents where the user has selected
    let range = win.getSelection().getRangeAt(0); // The range of the object.

    let preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.startContainer, range.startOffset);
    start = preCaretRange.toString().length;
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    end = preCaretRange.toString().length;

    // Add the 'Tab' \t and connects the two substrings from 0 to start and to the end.
    element.innerHTML = element.textContent.substr(0, start) + '\t' + element.textContent.substr(end);

    range.setStart(element.childNodes[0], start+1);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  // Star is not starred and goes into hovered state. 
  checkStarredOnHover() {
    if (!this.doc.starred) {
      this.imgSrc = 'assets/icons/star-icon-hovered.png';
    }
  }

  // Star is not starred and returns back to normal png file. 
  checkStarredOnUnhover() {
    if (!this.doc.starred) {
      this.imgSrc = 'assets/icons/star-icon.png';
    }
  }

  // Document is starred.
  toggleStarred() {
    if (this.doc.starred) {
      this.doc.starred = false; 
      this.imgSrc = 'assets/icons/star-icon-hovered.png';
    } else {
      this.doc.starred = true; 
      this.imgSrc = 'assets/icons/star-icon-checked.png';  
    }
    this.subscriptions.add(
      this.documentService.toggleStarred(this.doc._id, this.doc).subscribe((res) => {
        this.doc = res;   
      })
    )
  }

  // When document is focused, allow any changes to be saved.
  focusDoc() {
    this.documentFocus = true; 
  }

  // When document is unfocused, do not allow document changes to be saved. 
  unfocusDoc() {
    this.documentFocus = false;
  }

  ngOnDestroy() {
  	this.subscriptions.unsubscribe();
  }
}
