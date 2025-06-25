import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule , CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(private router: Router) {}
  activeItem: string = '';
  isDropdownOpen: boolean = false;
  isNotInVersionModal: boolean = false;

  setActiveItem(item: string) {
  this.activeItem = item; 
  this.router.navigate([`/${item}`]);
 }
 toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
 }

 logout() {
  localStorage.clear()
  this.router.navigate(['/']);
 }

 openNotInVersonModal() {
  this.isNotInVersionModal = true;
 }
 
 closeNotInVersionModal(){
  this.isNotInVersionModal = false;
}
 
}
