import { Injectable } from '@angular/core';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = `http://localhost:8080/api/tasks`;

  constructor(private http: HttpClient) {

  }
  getAssignees(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/assignees`);
  }

  getCreators(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/creators`);
  }

  getStatuses(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/statuses`);
  }
  getTasks(): Observable<any> {
    return this.http.get(`http://localhost:8080/api/tasks/getTasks`);
  }

createTask(task: any): Observable<any> {
  return this.http.post(`http://localhost:8080/api/tasks/createTask`, task);
}


  updateTask(task: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${task.id}`, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getAssigneesAndCreators(): Observable<string[]> {
    return this.http.get<string[]>(`http://localhost:8080/api/users/getAssigneesAndCreators`);
  }
}
