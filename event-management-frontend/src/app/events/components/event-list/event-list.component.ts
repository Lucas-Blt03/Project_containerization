import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../services/events.service';
import { Event } from '../../models/event.model';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  isLoading = true;
  error: string | null = null;
  searchTerm = '';
  categoryFilter = 'all';
  sortOption = 'date';
  
  categories: string[] = [];
  isAuthenticated = false;
  isOrganizer = false;
  
  constructor(
    private eventsService: EventsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.isOrganizer = this.authService.getUserRole() === 'organizer' || this.authService.getUserRole() === 'moderator';
    
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.error = null;
    
    // Use setTimeout to simulate API delay for demonstration
    setTimeout(() => {
      // Mock data for demonstration
      this.events = [
        {
          id: 1,
          title: 'Tech Conference 2023',
          description: 'Annual technology conference featuring the latest innovations.',
          date: '2023-05-15',
          location: 'San Francisco, CA',
          capacity: 500,
          price: 99.99,
          imageUrl: 'https://via.placeholder.com/300',
          organizerId: 1,
          organizerName: 'TechCorp',
          category: 'Technology',
          status: 'published',
          createdAt: '2023-01-10T12:00:00Z',
          updatedAt: '2023-01-10T12:00:00Z'
        },
        {
          id: 2,
          title: 'Music Festival',
          description: 'Three-day music festival with top artists from around the world.',
          date: '2023-07-20',
          location: 'Austin, TX',
          capacity: 10000,
          price: 150,
          imageUrl: 'https://via.placeholder.com/300',
          organizerId: 2,
          organizerName: 'Festival Productions',
          category: 'Music',
          status: 'published',
          createdAt: '2023-02-15T12:00:00Z',
          updatedAt: '2023-02-15T12:00:00Z'
        },
        {
          id: 3,
          title: 'Food & Wine Expo',
          description: 'Taste the finest cuisines and wines from renowned chefs and vineyards.',
          date: '2023-06-10',
          location: 'New York, NY',
          capacity: 300,
          price: 75,
          imageUrl: 'https://via.placeholder.com/300',
          organizerId: 3,
          organizerName: 'Culinary Arts Association',
          category: 'Food',
          status: 'published',
          createdAt: '2023-03-01T12:00:00Z',
          updatedAt: '2023-03-01T12:00:00Z'
        }
      ];
      
      // Extract unique categories
      this.categories = [...new Set(this.events.map(event => event.category))];
      
      this.filteredEvents = [...this.events];
      this.sortEvents();
      this.isLoading = false;
      
      // In production, use the actual service:
      /*
      this.eventsService.getEvents().subscribe({
        next: (events) => {
          this.events = events;
          this.categories = [...new Set(this.events.map(event => event.category))];
          this.filteredEvents = [...this.events];
          this.sortEvents();
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to load events. Please try again later.';
          this.isLoading = false;
        }
      });
      */
    }, 1000);
  }

  searchEvents(): void {
    this.applyFilters();
  }

  filterByCategory(category: string): void {
    this.categoryFilter = category;
    this.applyFilters();
  }

  sortBy(option: string): void {
    this.sortOption = option;
    this.sortEvents();
  }

  private applyFilters(): void {
    // First, filter by search term
    this.filteredEvents = this.events.filter(event => 
      event.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    
    // Then, filter by category if needed
    if (this.categoryFilter !== 'all') {
      this.filteredEvents = this.filteredEvents.filter(event => 
        event.category === this.categoryFilter
      );
    }
    
    // Finally, sort the results
    this.sortEvents();
  }

  private sortEvents(): void {
    switch(this.sortOption) {
      case 'date':
        this.filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'price-low':
        this.filteredEvents.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        this.filteredEvents.sort((a, b) => b.price - a.price);
        break;
      case 'title':
        this.filteredEvents.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Default sort by date
        this.filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
}