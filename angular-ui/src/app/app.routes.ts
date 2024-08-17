import { Routes } from '@angular/router';
import { CreateTaskComponent } from './create-task/create-task.component';
import { TaskDisplayComponent } from './task-display/task-display.component';
import { KanbanDashboardComponent } from './kanban-dashboard/kanban-dashboard.component';


export const routes: Routes = [
  { path: '', redirectTo: '/tasks/create', pathMatch: 'full' },
  { path: 'tasks/create', component: CreateTaskComponent },
  { path: 'tasks', component: TaskDisplayComponent },
  { path: 'kanban', component: KanbanDashboardComponent }
];
