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
import { identity } from 'rxjs';

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
  editUserForm!: FormGroup;

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
     
     
      this.editUserForm = this.fb.group({
        id: [''],
        name: ['', [Validators.required]],
        email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
        mobileno: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[0-9]+$')]],
      });
    this.fetchUsers();
  }

  createUser(): void {
    if (this.userForm.valid) {
      this.userService.createUser(this.userForm.value).subscribe(
        (response) => {
          console.log('User created successfully', response);
          this.userForm.reset();
          this.fetchUsers(); 
          this.closeModal(); 
          alert('User created successfully!');
        },
        (error) => {
          console.error('Error creating user', error);
          if (error.status === 409) {
            const errorMessage = error.error.message || 'Email or Mobile Number already exists!';
            // Show the error message on the relevant form control
            if (errorMessage.includes('Email')) {
              this.userForm.get('email')?.setErrors({ serverError: errorMessage });
            }
            if (errorMessage.includes('Mobile Number')) {
              this.userForm.get('mobileno')?.setErrors({ serverError: errorMessage });
            }
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

  openEditForm(user: any): void {
    console.log('User object:', user);  // Add this line to verify the user object

    this.editUserForm.patchValue({

        id: user.id,
        name: user.name,
        email: user.email,
        mobileno: user.mobileno,
        status: user.status
    });
}

updateUsername(): void {
  if (this.editUserForm.valid) {
    const updatedUser = this.editUserForm.getRawValue(); // Get form values including disabled fields

    this.userService.updateUsername(updatedUser).subscribe(
      (response) => {
        console.log('User updated successfully', response);
        this.fetchUsers(); 
        this.modalInstance.hide(); 
      },
      (error) => {
        console.error('Error updating user', error);
      }
    );
  }
}
  
  openEditModal(user: any): void {
    this.editUserForm.setValue({
      id: user.id,
      name: user.name,
      email: user.email,
      mobileno: user.mobileno
    });

    this.modalInstance = new bootstrap.Modal(document.getElementById('editUserModal'));
    this.modalInstance.show();
  }
  
 /* updateUser(): void {
    if (this.editUserForm.valid) {
        const updatedUser = this.editUserForm.value;
        const user = this.users.find(u => u.email === updatedUser.email);

        if (user) {
            updatedUser.id = user.id;

            this.userService.updateUsername(updatedUser).subscribe(
                (response) => {
                    console.log('User updated successfully', response);
                    this.fetchUsers(); 
                    this.modalInstance.hide(); 
                },
                (error) => {
                    console.error('Error updating user', error);
                }
            );
        } else {
            console.error('User not found');
        }}}

  */
  closeModal() {
    this.modalInstance = bootstrap.Modal.getInstance(document.getElementById('createUserModal'));
    this.modalInstance.hide();
  }
}

