import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  constructor(private http: HttpClient) {}
  baseUrl: string = 'https://routeegypt.herokuapp.com/';
  // -------- Add Note
  addNote(data: object): Observable<any> {
    return this.http.post(`${this.baseUrl}addNote`, data);
  }
  // -------- Get Note
  getNoteUser(data:object):Observable<any> {
    return this.http.post(`${this.baseUrl}getUserNotes`,data)
  }
  // --------- delet Note 
  deleteNote(data:Object):Observable<any> {
    return this.http.delete(`${this.baseUrl}deleteNote`,data)
  }
  // -------- update Note
  updateNote(data:Object):Observable<any> {
    return this.http.put(`${this.baseUrl}updateNote`,data)
  }
}
