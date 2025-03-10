import { Routes } from '@angular/router';
import { CreateTaskComponent } from './create-task/create-task.component';
import { TaskDisplayComponent } from './task-display/task-display.component';
import { KanbanDashboardComponent } from './kanban-dashboard/kanban-dashboard.component';
import { UserComponent } from './user/user.component';


export const routes: Routes = [
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { path: 'tasks/create', component: CreateTaskComponent },
  { path: 'tasks', component: TaskDisplayComponent },
  { path: 'kanban', component: KanbanDashboardComponent },
  {path:'users',component:UserComponent}
];
