import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
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
  displayedColumns: string[] = ['name', 'description', 'assignee', 'creator', 'status', 'actions'];
  currentView: string = 'table'; // Default view is table view

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(data => {
      this.tasks = data;
      this.extractDropdownData(data);
    });
  }

  extractDropdownData(tasks: any[]): void {
    this.assignees = [...new Set(tasks.map(task => task.assignee))];
    this.creators = [...new Set(tasks.map(task => task.creator))];
    this.statuses = [...new Set(tasks.map(task => task.status))];
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
    this.onSave(task);
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
