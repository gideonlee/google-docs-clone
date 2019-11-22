import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MatDialogModule } from "@angular/material/dialog";
import { AppComponent } from './app.component';
import { DocumentComponent } from './components/document/document.component';
import { DocumentService } from './services/document.service';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RenameDialogComponent } from './components/rename-dialog/rename-dialog.component';
import { UndoRenameDialogComponent } from './components/undo-rename-dialog/undo-rename-dialog.component';
import { RevertRenameDialogComponent } from './components/revert-rename-dialog/revert-rename-dialog.component';
import { UndoDeleteDialogComponent } from './components/undo-delete-dialog/undo-delete-dialog.component';
import { RestoreFileDialogComponent } from './components/restore-file-dialog/restore-file-dialog.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'http://localhost:4444', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    DocumentComponent,
    DocumentListComponent,
    RenameDialogComponent,
    UndoRenameDialogComponent,
    RevertRenameDialogComponent,
    UndoDeleteDialogComponent,
    RestoreFileDialogComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    SocketIoModule.forRoot(config),
    MatCheckboxModule
  ],
  providers: [DocumentService],
  bootstrap: [AppComponent],
  entryComponents: [RenameDialogComponent, UndoRenameDialogComponent, RevertRenameDialogComponent, UndoDeleteDialogComponent, RestoreFileDialogComponent],
})
export class AppModule { }
