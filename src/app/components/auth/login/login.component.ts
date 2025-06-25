import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {  FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/apiServices/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
  
  @Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatInputModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isNotInVersionModal: boolean = false;
  constructor(
    private router: Router,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
    
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if(this.loginForm.valid){
      const {username , password} = this.loginForm.value;
    this.apiService.login(username, password).subscribe({
      next: (response) => {
        this.snackBar.open('Inicio de sesión exitoso.', 'Cancelar', { duration: 3000 });

        const user = response.user;
          localStorage.setItem('user_id', user.user_id.toString());
          localStorage.setItem('username', user.username);
          localStorage.setItem('name', user.name);
          localStorage.setItem('last_name', user.last_name);

        this.router.navigate(['/comparador-curricular']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.snackBar.open('Inicio de sesión fallido. Por favor, verifica tus credenciales.', 'Cancelar', { duration: 3000 });
      },
    });
    }
  }
  closeNotInVersionModal(){
    this.isNotInVersionModal = false;
  }
  notInVersionModal(){
    this.isNotInVersionModal = true;
  }
}
