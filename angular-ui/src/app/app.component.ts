import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule, RouterOutlet } from '@angular/router';
import { CreateTaskComponent } from './create-task/create-task.component';
import { Router } from '@angular/router';
declare var bootstrap: any; 
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CreateTaskComponent,ReactiveFormsModule,FormsModule,RouterModule,CommonModule,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit {

  modalOpen = false;
  constructor(private renderer: Renderer2, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const modalElement = document.getElementById('taskModal');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
        }
      }, 0);
    }}
openmodal() {
  this.modalOpen = true;
}
onSubmit() {
throw new Error('Method not implemented.');

}



ngOnInit(): void {
  
}
  title = 'Task Management System';

    
  isTableViewVisible = false;
  isCardViewVisible = false;
taskForm: any;
assignees: any;
creators: any;
statuses: any;

  showTableView() {
    this.isTableViewVisible = true;
    this.isCardViewVisible = false;
  }

  showCardView() {
    this.isTableViewVisible = false;
    this.isCardViewVisible = true;

 
  }
}
