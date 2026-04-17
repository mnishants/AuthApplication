import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationService } from '../../services/registration.service';

export interface AgentData {
  ID: string;
  REGISTRATION_REF_NO: string;
  COMPANY_NAME: string;
  COMPANY_ADDRESS: string;
  CONTACT_PERSON_NAME: string;
  DESIGNATION: string;
  MOBILE_NUMBER: string;
  IS_ACTIVE: boolean;
  CREATED_ON: string;
}

@Component({
  selector: 'app-registered-agents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registered-agents.component.html',
  styleUrl: './registered-agents.component.css',
})
export class RegisteredAgentsComponent implements OnInit {
  agents: AgentData[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  updatingAgentId: string = '';

  constructor(private registrationService: RegistrationService) {}

  ngOnInit(): void {
    this.loadAgents();
  }

  loadAgents(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.registrationService.getRegisteredAgents().subscribe({
      next: (data) => {
        this.agents = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading agents', err);
        this.errorMessage = 'Failed to load registered agents. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  toggleAgentStatus(agent: AgentData): void {
    const newStatus = !agent.IS_ACTIVE;
    this.updatingAgentId = agent.ID;

    this.registrationService.updateAgentStatus(agent.ID, newStatus).subscribe({
      next: (response) => {
        agent.IS_ACTIVE = newStatus;
        this.updatingAgentId = '';
      },
      error: (err) => {
        console.error('Error updating agent status', err);
        this.errorMessage = `Failed to ${newStatus ? 'activate' : 'deactivate'} agent. Please try again.`;
        this.updatingAgentId = '';
      }
    });
  }
}