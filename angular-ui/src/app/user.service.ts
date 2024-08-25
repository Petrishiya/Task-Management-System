import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from './User';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users'; // Base URL for the user API

  constructor(private http: HttpClient) {}

  // Method to fetch all users
  fetchUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllUsers`);
  }

  // Method to create a new user
  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createUser`, userData);
  }

  getAssigneesAndCreators(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/getAssigneesAndCreators`);
  }
  updateUserStatus(userId: number, isActive: boolean): Observable<User> {
    const status = isActive ? 'ACTIVE' : 'INACTIVE';
    return this.http.put<User>(`${this.apiUrl}/updateStatus/${userId}`, { status });
  }
  
  /*updateUserStatus(userId: number, status: boolean): Observable<any> {
    const url = `${this.apiUrl}/updateUserStatus/${userId}`;
    return this.http.put(url, { status })
      .pipe(
        catchError(this.handleError<any>('updateUserStatus'))
      );
  }*/
      updateUser(user: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/update/${user.id}`, user);
      }

      updateUsernameAndMobile(user: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/updateUsernameAndMobile/${user.id}`, user);
      }
    

      
  // Generic error handling method
  /*private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return throwError(() => new Error(`${operation} failed: ${error.message}`));
    };
  }*/
}
