import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { UserService } from '../user.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
 
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
    MatSlideToggleModule,
    DragDropModule
  ],
  templateUrl: './task-display.component.html',
  styleUrls: ['./task-display.component.css']
})
export class TaskDisplayComponent implements OnInit {
  tasks: any[] = [];
  assignees: string[] = [];
  creators: string[] = [];
  statuses: string[] = [];
  displayedColumns: string[] = ['name', 'description', 'assignee', 'creator', 'status','actions'];
  currentView: string = 'table';
  connectedDropLists: string[] = [];
  highlightedColumn: string | null = null;
 
 
  constructor(private taskService: TaskService, private userService: UserService, private cdr: ChangeDetectorRef) {}
 
  ngOnInit(): void {
    this.taskService.getTasks().subscribe(data => {
      this.tasks = data;
      this.extractStatuses(data);
    });
 
    this.fetchAssignees();
    this.fetchCreators();
  }
 
  fetchAssignees(): void {
    this.taskService.getAssignees().subscribe(
      (activeUsers) => {
        this.assignees = activeUsers;
      },
      error => {
        console.error('Error fetching assignees', error);
      }
    );
  }
 
  fetchCreators(): void {
    this.taskService.getCreators().subscribe(
      (activeUsers) => {
        this.creators = activeUsers;
      },
      error => {
        console.error('Error fetching creators', error);
      }
    );
  }
 
 /* extractStatuses(tasks: any[]): void {
    this.statuses = [...new Set(tasks.map(task => task.status))];
  }*/
 
 
  extractStatuses(tasks:any): void {

    this.taskService.getStatuses().subscribe(
    //this.statuses = [...new Set(tasks.map(task => task.status))];
      (response:any) => {

        this.statuses = this.sortStatuses(response);
        this.connectedDropLists = this.statuses.map(status => `${status}List`);


        this.fetchTasks();

      },

      (error:any) => {

        console.error('Error fetching statuses', error);

      }

    );

  }
 
  sortStatuses(statuses: string[]): string[] {

    const order = ['TO-DO', 'IN-PROGRESS', 'READY FOR QA', 'DONE'];

    return statuses.sort((a, b) => order.indexOf(a) - order.indexOf(b));

  }
 
  fetchTasks(): void {

    this.taskService.getTasks().subscribe(

      (response:any) => {

        this.tasks = response;

      },

      (error:any) => {

        console.error('Error fetching tasks', error);

      }

    );

  }
 
  getTasksByStatus(status: string): any[] {
    return this.tasks.filter(task => task.status === status);
  }
 
  getStatusColor(status: string): string {
    switch (status) {
      case 'TO-DO':
        return 'status-open';
      case 'IN PROGRESS':
        return 'status-in-progress';
      case 'DONE':
        return 'status-completed';
      case 'READY FOR QA':
        return 'status-ready-for-qa';
      default:
        return '';
    }
  }
 
  getConnectedDropLists(): string[] {
    return this.statuses.map(status => `${status}List`);
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
    this.cdr.markForCheck();
  }
 
  selectedTask: any = null; // Selected task for detailed view
 
 
  toggleActive(task: any): void {
    task.isActive = !task.isActive;
    this.taskService.updateTask(task).subscribe();
  }
 
  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe(() => {
      this.tasks = this.tasks.filter(task => task.id !== taskId);
    });
  }
 
  onDoubleClick(task: any, field: string): void {
    task.editingField = field;
  }
  selectTask(task: any): void {
    this.selectedTask = task; // Store selected task for detailed view
  }
 
  closeTaskDetails(): void {
    this.selectedTask = null; // Close task details modal
  }
 
  onDrop(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      const movedTask = event.container.data[event.currentIndex];
      movedTask.status = event.container.id.replace('List', '');
      this.onStatusChange(movedTask);
      this.highlightedColumn = null;
 
    }
  }
 
  onStatusChange(task: any): void {
    this.taskService.updateTask(task).subscribe(() => {
      this.cdr.markForCheck();
    });
  }
  highlightColumn(event: any, columnId: string) {
    this.removeAllHighlights();
    document.getElementById(columnId)?.classList.add('highlight');
  }
 
  removeHighlight(columnId: string) {
    document.getElementById(columnId)?.classList.remove('highlight');
  }
 
  removeAllHighlights() {
    const columns = document.querySelectorAll('.kanban-column');
    columns.forEach(column => column.classList.remove('highlight'));
  }
 
  onDragStart(task: any): void {
    task.isDragging = true;
  }
 
  onDragEnd(task: any): void {
    task.isDragging = false;
    this.highlightedColumn = null;  // Remove column highlight
  }
 
  onColumnEnter(status: string): void {
    this.highlightedColumn = status;
  }
 
  onColumnExit(status: string): void {
    if (this.highlightedColumn === status) {
      this.highlightedColumn = null;
    }
  }
  canEnter(): boolean {
    return true;
  }
 
}
 
 