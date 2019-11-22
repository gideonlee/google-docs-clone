import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
// import { Socket } from 'ngx-socket-io';
import { Document } from '../models/document';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
	// currentDocument = this.socket.fromEvent<Document>('document');
	baseUri: string = 'http://localhost:4000/api';
	headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  // Create New Document
  createDoc(data): Observable<any> {
  	let url = `${this.baseUri}/documents`;
  	return this.http.post(url, data).pipe(catchError(this.errorMgmt));
  }

  // Find a Document based on the _id
  findDoc(id): Observable<any> {
    let url = `${this.baseUri}/documents/${id}`;
    return this.http.get(url).pipe(catchError(this.errorMgmt));
  }

  // Get all documents 
  getAllDocs(): Observable<any> {
    let url = `${this.baseUri}/documents`;
    return this.http.get(url).pipe(catchError(this.errorMgmt));
  }

  // Renames a document
  renameDoc(id, doc): Observable<any> {
    let url = `${this.baseUri}/documents/${id}`;
    return this.http.patch(url, doc).pipe(catchError(this.errorMgmt));
  }

  // Update a document body
  updateDoc(id, doc): Observable<any> {
    let url = `${this.baseUri}/documents/${id}`;
    return this.http.patch(url, doc).pipe(catchError(this.errorMgmt));
  }

  // Toggled starred of a document.
  toggleStarred(id, doc): Observable<any> {
    let url =`${this.baseUri}/documents/${id}`;
    return this.http.patch(url, doc).pipe(catchError(this.errorMgmt));
  }

  // Remove selected document
  removeDoc(id): Observable<any> {
    let url = `${this.baseUri}/documents/${id}`;
    return this.http.delete(url).pipe(catchError(this.errorMgmt));
  }

  errorMgmt(res: HttpErrorResponse) {
  	let errorMessage = ``;
  	if (res.error instanceof ErrorEvent) {
  		errorMessage = res.error.message;
  	} else {
  		errorMessage = `Error Code: ${res.status}\nMessage: ${res.message}`;
  	}
  	console.log(`Error found on Api Side`);
  	console.log(errorMessage);
  	return throwError(errorMessage);
  }
}
