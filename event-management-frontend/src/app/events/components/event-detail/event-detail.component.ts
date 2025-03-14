import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from '../../services/events.service';
import { Event } from '../../models/event.model';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent implements OnInit {
  eventId: number;
  event: Event | null = null;
  isLoading = true;
  error: string | null = null;
  
  isAuthenticated = false;
  isOrganizer = false;
  isEventOrganizer = false;
  isModerator = false;
  isRegistered = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService,
    private authService: AuthService
  ) {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    if (isNaN(this.eventId)) {
      this.router.navigate(['/events']);
      return;
    }
    
    this.isAuthenticated = this.authService.isAuthenticated();
    const userRole = this.authService.getUserRole();
    this.isOrganizer = userRole === 'organizer';
    this.isModerator = userRole === 'moderator';
    
    this.loadEvent();
  }

  loadEvent(): void {
    this.isLoading = true;
    this.error = null;
    
    // Simulate API delay for demonstration
    setTimeout(() => {
      // Mock data for demonstration
      const mockEvent: Event = {
        id: this.eventId,
        title: 'Tech Conference 2023',
        description: 'Annual technology conference featuring the latest innovations in AI, blockchain, and more. Join us for three days of workshops, keynotes, and networking opportunities with industry leaders.',
        date: '2023-05-15',
        location: 'San Francisco Convention Center, CA',
        capacity: 500,
        price: 99.99,
        imageUrl: 'https://via.placeholder.com/800x400',
        organizerId: 1,
        organizerName: 'TechCorp',
        category: 'Technology',
        status: 'published',
        createdAt: '2023-01-10T12:00:00Z',
        updatedAt: '2023-01-10T12:00:00Z'
      };
      
      this.event = mockEvent;
      
      // Check if current user is the event organizer
      const currentUser = this.authService.currentUserValue;
      if (currentUser) {
        this.isEventOrganizer = currentUser.id === this.event.organizerId;
      }
      
      // Random boolean for demonstration - in production, this would be from API
      this.isRegistered = Math.random() > 0.5;
      
      this.isLoading = false;
      
      // In production, use the actual service:
      /*
      this.eventsService.getEvent(this.eventId).subscribe({
        next: (event) => {
          this.event = event;
          const currentUser = this.authService.currentUserValue;
          if (currentUser) {
            this.isEventOrganizer = currentUser.id === this.event.organizerId;
          }
          this.isLoading = false;
          
          // Check if user is registered for the event
          // Additional API call would be needed here
        },
        error: (err) => {
          this.error = 'Failed to load event details. Please try again later.';
          this.isLoading = false;
        }
      });
      */
    }, 1000);
  }

  registerForEvent(): void {
    if (!this.isAuthenticated) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: `/events/${this.eventId}` } });
      return;
    }
    
    // In production, use the actual service:
    /*
    this.eventsService.registerForEvent(this.eventId).subscribe({
      next: () => {
        this.isRegistered = true;
      },
      error: (err) => {
        // Handle error
      }
    });
    */
    
    // For demonstration purposes
    this.isRegistered = true;
  }

  cancelRegistration(): void {
    // In production, use the actual service:
    /*
    this.eventsService.cancelRegistration(this.eventId).subscribe({
      next: () => {
        this.isRegistered = false;
      },
      error: (err) => {
        // Handle error
      }
    });
    */
    
    // For demonstration purposes
    this.isRegistered = false;
  }

  editEvent(): void {
    this.router.navigate(['/events', this.eventId, 'edit']);
  }

  deleteEvent(): void {
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      // In production, use the actual service:
      /*
      this.eventsService.deleteEvent(this.eventId).subscribe({
        next: () => {
          this.router.navigate(['/events']);
        },
        error: (err) => {
          // Handle error
        }
      });
      */
      
      // For demonstration purposes
      this.router.navigate(['/events']);
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
}