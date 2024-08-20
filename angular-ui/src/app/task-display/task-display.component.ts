import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { UserService } from '../user.service'; // Import the UserService to fetch assignees and creators
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-task-display',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule,
    MatSlideToggleModule
  ],
  templateUrl: './task-display.component.html',
  styleUrls: ['./task-display.component.css']
})
export class TaskDisplayComponent implements OnInit {
  tasks: any[] = [];
  assignees: string[] = [];
  creators: string[] = [];
  statuses: string[] = [];
  displayedColumns: string[] = ['name', 'description', 'assignee', 'creator', 'status'];
  currentView: string = 'table'; // Default view is table view

  constructor(private taskService: TaskService, private userService: UserService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(data => {
      this.tasks = data;
      this.extractStatuses(data);  // Extract statuses from tasks
    });

    this.fetchAssignees(); 
    this.fetchCreators();// Fetch updated assignees and creators
  }
  

  fetchAssignees(): void {
    this.taskService.getAssignees().subscribe((activeUsers) => {
      this.assignees = activeUsers;
      },
      error => {
        console.error('Error fetching assignees', error);
      }
    );
  }

  fetchCreators(): void {
    this.taskService.getCreators().subscribe((activeUsers) => {
      this.creators = activeUsers;
      },
    (error )=> {
        console.error('Error fetching creators', error);
      }
    );
  }


  extractStatuses(tasks: any[]): void {
    this.statuses = [...new Set(tasks.map(task => task.status))];
  }

  /*fetchAssigneesAndCreators(): void {
    this.userService.getas().subscribe(data => {
      this.assignees = data;
      this.creators = data; // Assuming the assignees and creators are the same
    });
  }*/
    getStatusColor(status: string): string {
      switch (status) {
        case 'TO-DO':  // Assuming 'TO-DO' is the value from the backend
          return 'status-open';
        case 'IN PROGRESS':  // Assuming 'IN PROGRESS' is the value from the backend
          return 'status-in-progress';
        case 'DONE':  // Assuming 'DONE' is the value from the backend
          return 'status-completed';
        case 'READY FOR QA':  // Assuming 'READY FOR QA' is the value from the backend
          return 'status-ready-for-qa';
        default:
          return '';
      }
    }
    

  onEditCell(task: any, field: string): void {
    task.editingField = field;
  }

  onSave(task: any): void {
    this.taskService.updateTask(task).subscribe(() => {
      delete task.editingField;
    });
  }

  onCellBlur(task: any): void {
  delete task.editingField;
  this.cdr.markForCheck();  // 

  }

  onStatusChange(task: any): void {
    this.taskService.updateTask(task).subscribe(() => {
      this.cdr.markForCheck();  
    });
  }
  toggleActive(task: any): void {
    task.isActive = !task.isActive;
    this.taskService.updateTask(task).subscribe();  // Update task status in the backend
  }

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe(() => {
      this.tasks = this.tasks.filter(task => task.id !== taskId);
    });
  }

  onDoubleClick(task: any, field: string): void {
    task.editingField = field;
  }

}
