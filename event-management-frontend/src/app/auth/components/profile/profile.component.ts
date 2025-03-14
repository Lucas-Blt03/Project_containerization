import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    
    // Subscribe to user changes
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  getRoleBadgeClass(): string {
    switch (this.currentUser?.role) {
      case 'moderator':
        return 'bg-danger';
      case 'organizer':
        return 'bg-success';
      default:
        return 'bg-primary';
    }
  }
}