import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service'; // Import the UserService
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioButton } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

declare var bootstrap: any; // Declare bootstrap for using modal programmatically

@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  imports: [HttpClientModule, ReactiveFormsModule, FormsModule, CommonModule,MatRadioButton,
    MatInputModule,MatFormFieldModule,MatTableModule,MatSelectModule,MatOptionModule,MatButtonModule,
    MatCardModule,MatRadioModule,MatSlideToggleModule]
})
export class UserComponent implements OnInit {
  userForm!: FormGroup;
  users: any[] = [];

  modalInstance: any;
displayedColumns: any;

  constructor(private fb: FormBuilder, private userService: UserService) {}

  toggleUserStatus(user: any): void {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    const confirmation = window.confirm(`Are you sure you want to change the status to ${newStatus}?`);
    
    if (confirmation) {
      this.userService.updateUserStatus(user.id, newStatus === 'ACTIVE').subscribe(
        (updatedUser) => {
          user.status = updatedUser.status; // Update the status in the local array
          console.log('User status updated', updatedUser);
          this.fetchUsers(); 
        },
        (error) => {
          console.error('Error updating user status', error);
        }
      );
    }
  }


  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobileno: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      status: ['ACTIVE', Validators.required] });
      displayedColumns: [] = ['name', 'email', 'mobileno'];
    this.fetchUsers();
  }

  // Method to create a new user
  createUser() {
    if (this.userForm.valid) {
      this.userService.createUser(this.userForm.value).subscribe(
        (response) => {
          console.log('User created successfully', response);
          this.userForm.reset();
          this.fetchUsers(); 
          this.closeModal(); 
          this.updateAssigneesAndCreators(); 
          alert('User created successfully!');

        },
        (error) => {
          console.error('Error creating user', error);
          if (error.status === 409) {
            alert('Email or Mobile Number already exists!');
          } else if (error.status === 400) {
            alert('Invalid input. Please check your data and try again.');
          } else {
            alert('An unexpected error occurred while creating the user.');
          }
        }
      );
    }
  }
  updateAssigneesAndCreators() {
    this.userService.getAssigneesAndCreators().subscribe(
      (data) => {
        // Update your dropdowns or components here
        console.log('Updated assignees and creators', data);
      },
      (error) => {
        console.error('Error updating assignees and creators', error);
      }
    );
  }
  // Method to fetch all users
  fetchUsers() {
    this.userService.fetchUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }
/*
  updateUserStatus(user: any) {
    // Call the update status API from the user service
    this.userService.updateUserStatus(user.id, user.status).subscribe(
      (response) => {
        console.log('User status updated successfully', response);
      },
      (error) => {
        console.error('Error updating user status', error);
      }
    );
  }  
  */
  updateUserStatus(userId: number, isActive: boolean): void {
    this.userService.updateUserStatus(userId, isActive).subscribe(
      (updatedUser) => {
        console.log('User status updated', updatedUser);
        // Optionally, refresh the user list
        this.fetchUsers();
      },
      (error) => {
        console.error('Error updating user status', error);
      }
    );
  }
  
  
  
  
  
  closeModal() {
    this.modalInstance = bootstrap.Modal.getInstance(document.getElementById('createUserModal'));
    this.modalInstance.hide();
  }
}
