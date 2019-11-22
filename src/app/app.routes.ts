import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentComponent } from './components/document/document.component';
import { DocumentListComponent } from './components/document-list/document-list.component';

const APP_ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'documents' },
	{ path: 'documents', component: DocumentListComponent },
	{ path: 'documents/:id', component: DocumentComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(APP_ROUTES)],
	exports: [RouterModule]
})

export class AppRoutingModule { }
