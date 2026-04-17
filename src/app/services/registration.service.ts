import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private apiUrl = 'https://your-api-endpoint.com/register'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  submitRegistration(formData: any): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  getRegisteredAgents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/agents`); // Assuming endpoint for getting agents
  }

  updateAgentStatus(agentId: string, isActive: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/agents/${agentId}`, { IS_ACTIVE: isActive });
  }
}