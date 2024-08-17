import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, CdkDragEnter, CdkDragExit, transferArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { TaskService } from '../task.service';
import { Task } from '../model/Task';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatCardModule, DragDropModule],
  templateUrl: './kanban-dashboard.component.html',
  styleUrls: ['./kanban-dashboard.component.css']
})
export class KanbanDashboardComponent implements OnInit {

  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  readyForQaTasks: Task[] = [];
  doneTasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.categorizeTasks(tasks);
    });
  }

  categorizeTasks(tasks: Task[]): void {
    this.todoTasks = tasks.filter(task => this.normalizeStatus(task.status) === 'TO-DO');
    this.inProgressTasks = tasks.filter(task => this.normalizeStatus(task.status) === 'INPROGRESS');
    this.readyForQaTasks = tasks.filter(task => this.normalizeStatus(task.status) === 'READY FOR QA');
    this.doneTasks = tasks.filter(task => this.normalizeStatus(task.status) === 'DONE');
  }

  normalizeStatus(status: string): string {
    switch (status.toLowerCase()) {
      case 'to-do':
      case 'todo':
      case 'to do':
        return 'TO-DO';
      case 'inprogress':
      case 'in progress':
      case 'in-progress':
        return 'INPROGRESS';
      case 'ready for qa':
      case 'ready-for-qa':
      case 'readyforqa':
        return 'READY FOR QA';
      case 'done':
        return 'DONE';
      default:
        return status.toUpperCase(); // Default to upper case if it's an unrecognized status
    }
  }

 

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer !== event.container) {
      const task = event.previousContainer.data[event.previousIndex];
      this.updateTaskStatus(task, event.container.id);
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    } else {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  updateTaskStatus(task: Task, containerId: string): void {
    switch (containerId) {
      case 'todoList':
        task.status = this.normalizeStatus('to-do');
        break;
      case 'inProgressList':
        task.status = this.normalizeStatus('inprogress');
        break;
      case 'readyForQaList':
        task.status = this.normalizeStatus('ready for qa');
        break;
      case 'doneList':
        task.status = this.normalizeStatus('done');
        break;
    }
    this.taskService.updateTask(task).subscribe();
  }

  highlightColumn(event: any, columnId: string) {
    this.removeAllHighlights();  // Remove highlights from all columns first
    document.getElementById(columnId)?.classList.add('highlight');
  }

  removeHighlight(columnId: string) {
    document.getElementById(columnId)?.classList.remove('highlight');
  }

  removeAllHighlights() {
    const columns = document.querySelectorAll('.kanban-column');
    columns.forEach(column => column.classList.remove('highlight'));
  }
}
