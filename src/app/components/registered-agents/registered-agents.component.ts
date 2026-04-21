import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentData, RegistrationService } from '../../services/registration.service';

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
  updatingAgentId: number | null = null;

  constructor(
    private registrationService: RegistrationService,
    private cdr: ChangeDetectorRef
  ) {}

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
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading agents', err);
        this.errorMessage = 'Failed to load registered agents. Please try again later.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleAgentStatus(agent: AgentData): void {
    this.setAgentStatus(agent, !agent.isActive);
  }

  setAgentStatus(agent: AgentData, newStatus: boolean): void {
    if (this.updatingAgentId !== null) {
      return;
    }

    if (agent.isActive === newStatus) {
      return;
    }

    this.updatingAgentId = agent.agent_ID;

    this.registrationService.updateAgentStatus(agent.agent_ID, newStatus).subscribe({
      next: () => {
        agent.isActive = newStatus;
        this.updatingAgentId = null;
        this.loadAgents();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error updating agent status', err);
        this.errorMessage = `Failed to ${newStatus ? 'activate' : 'deactivate'} agent. Please try again.`;
        this.updatingAgentId = null;
        this.cdr.detectChanges();
      }
    });
  }
}