import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface AgentData {
  id: number;
  agent_ID: number;
  countryId: number;
  cityId: number;
  registrationRefNo: string;
  companyName: string;
  companyAddress: string;
  landlineNumber: string;
  website: string;
  fax: string;
  faxNumber: string;
  companyEmail: string;
  licenseNumber: string | null;
  contactPersonName: string;
  designation: string;
  mobileNumber: string;
  allowedSubusers: number;
  registrationStatus: string | null;
  adminUserName: string;
  numberOfProposedUsers: number;
  isActive: boolean;
  createdOn: string;
  updatedOn: string | null;
}

export interface CountryData {
  countryAlpha2Code: string;
  countryAlpha3Code: string | null;
  countryName: string;
  countryId: number;
}

export interface CityData {
  cityId: number;
  cityCode: string;
  cityName: string;
}

export interface RegisterAgentPayload {
  agenT_ID: number;
  countryId: number;
  cityId: number;
  companyName: string;
  companyAddress: string;
  landlineNumber: string;
  website: string;
  faxNumber: string;
  companyEmail: string;
  licenseNumber: string;
  contactPersonName: string;
  designation: string;
  mobileNumber: string;
  numberOfProposedUsers: number;
  adminUserName: string;
  subUserNames: string[];
}

interface GetAgentsApiResponse {
  value?: AgentData[];
  Value?: AgentData[];
  items?: AgentData[];
  $values?: AgentData[];
  data?: AgentData[];
  result?: AgentData[];
}

interface WrappedListResponse<T> {
  value?: T[];
  Value?: T[];
  items?: T[];
  data?: T[];
  result?: T[];
}

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private agentApiBaseUrl = '/api/Agent';

  constructor(private http: HttpClient) { }

  submitRegistration(payload: RegisterAgentPayload): Observable<any> {
    return this.http.post(`${this.agentApiBaseUrl}/register`, payload);
  }

  getRegisteredAgents(): Observable<AgentData[]> {
    return this.http.get<AgentData[] | GetAgentsApiResponse>(`${this.agentApiBaseUrl}/GetAgent`).pipe(
      map((response) => {
        if (Array.isArray(response)) {
          return response;
        }

        if (response?.value && Array.isArray(response.value)) {
          return response.value;
        }

        if (response?.Value && Array.isArray(response.Value)) {
          return response.Value;
        }

        if (response?.items && Array.isArray(response.items)) {
          return response.items;
        }

        if (response?.$values && Array.isArray(response.$values)) {
          return response.$values;
        }

        if (response?.data && Array.isArray(response.data)) {
          return response.data;
        }

        if (response?.result && Array.isArray(response.result)) {
          return response.result;
        }

        if (response?.value && !Array.isArray(response.value)) {
          return [response.value as AgentData];
        }

        return [];
      })
    );
  }

  getCountries(): Observable<CountryData[]> {
    return this.http.get<CountryData[] | WrappedListResponse<CountryData>>('/api/Countries').pipe(
      map((response) => this.extractArray(response))
    );
  }

  getCitiesByCountry(countryId: number): Observable<CityData[]> {
    return this.http.get<CityData[] | WrappedListResponse<CityData>>(`${this.agentApiBaseUrl}/GetCityByCountry?CountryID=${countryId}`).pipe(
      map((response) => this.extractArray(response))
    );
  }

  updateAgentStatus(agentId: number, isActive: boolean): Observable<any> {
    return this.http.post(`${this.agentApiBaseUrl}/${agentId}/approve`, {
      agentId,
      status: String(isActive),
    });
  }

  private extractArray<T>(response: T[] | WrappedListResponse<T>): T[] {
    if (Array.isArray(response)) {
      return response;
    }

    if (response?.value && Array.isArray(response.value)) {
      return response.value;
    }

    if (response?.Value && Array.isArray(response.Value)) {
      return response.Value;
    }

    if (response?.items && Array.isArray(response.items)) {
      return response.items;
    }

    if (response?.data && Array.isArray(response.data)) {
      return response.data;
    }

    if (response?.result && Array.isArray(response.result)) {
      return response.result;
    }

    return [];
  }
}