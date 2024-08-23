import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
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
 
declare var bootstrap: any;
 
@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatRadioButton,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule,
    MatSlideToggleModule
  ]
})
export class UserComponent implements OnInit {
  userForm!: FormGroup;
  editUserForm!: FormGroup;
  users: any[] = [];
  modalInstance: any;
  displayedColumns: string[] = ['name', 'email', 'mobileno', 'status', 'actions'];
  errorMessage: string = '';  // Add a property to store the error message
 
  constructor(private fb: FormBuilder, private userService: UserService) {}
 
  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobileno: ['', [Validators.required, Validators.pattern('^[0-9]+$ [0-9]{0-10}')]],
      status: ['ACTIVE', Validators.required]
    });
 
    this.editUserForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      mobileno: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      status: ['', Validators.required]
    });
 
    this.fetchUsers();
  }
 
  fetchUsers(): void {
    this.userService.fetchUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
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
        (error) => 
          {
          console.error('Error creating user', error);
          if (error.status === 409) 
            {
            const errorMessage = error.message || 'Email Id already exists!';
              this.userForm.get('email')?.setErrors({ serverError: "Email Id already exists" });
            
            }
            if (error.status === 409) 
            {
              const errorMessage = error.message || 'Email or Mobile Number already exists!';

              this.userForm.get('mobileno')?.setErrors({ serverError: "Mobile no already exists" });
            }
          
           else if (error.status === 400) {
            this.errorMessage = 'Invalid input. Please check your data and try again.';
          } else {
            this.errorMessage = 'An unexpected error occurred while creating the user.';
          }

        }
      );

    }

  }
 
  updateUsernameAndMobile(): void {
    console.log('Update method triggered');
    if (this.editUserForm.valid) {
        const updatedUser = this.editUserForm.getRawValue(); // Get form values including disabled fields
 
        this.userService.updateUsernameAndMobile(updatedUser).subscribe(
            (response) => {
                console.log('User updated successfully', response);
                alert("User Detail updated");
                this.fetchUsers();
                this.modalInstance.hide();
            },
            (error) => {
                console.error('Error updating user', error);
                alert('Error updating user');

                if (error.status === 409) {
                  this.userForm.get('email')?.setErrors({ serverError: error });
                }
                if (error.includes('Mobile Number')) {
                  this.userForm.get('mobileno')?.setErrors({ serverError: error });
                }
             
               /* if (error.status === 409) {
                    this.errorMessage = error.error.message || 'Email or Mobile Number already exists!';
                } else {
                    this.errorMessage = 'An unexpected error occurred while updating the user.';
                }*/
            }
        );
    } else {
        console.log('Form is invalid');
    }
  }
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
 
openEditModal(user: any): void {
  this.editUserForm.patchValue({
    id: user.id,
    name: user.name,
    email: user.email,
    mobileno: user.mobileno,
    status: user.status
  });

  this.modalInstance = new bootstrap.Modal(document.getElementById('editUserModal'));
  this.modalInstance.show();
}

closeModal(): void {
  this.modalInstance = bootstrap.Modal.getInstance(document.getElementById('createUserModal'));
  this.modalInstance.hide();
}
}
 