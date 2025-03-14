import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventsService } from '../../services/events.service';
import { EventCreateDto } from '../../models/event.model';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss']
})
export class EventCreateComponent implements OnInit {
  eventForm: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  
  // Predefined categories for selection
  categories: string[] = ['Technology', 'Music', 'Food', 'Arts', 'Sports', 'Business', 'Health', 'Education', 'Other'];
  
  constructor(
    private formBuilder: FormBuilder,
    private eventsService: EventsService,
    private router: Router
  ) {
    this.eventForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      date: ['', Validators.required],
      location: ['', Validators.required],
      capacity: [100, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      category: ['Technology', Validators.required]
    });
  }

  ngOnInit(): void {
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    this.eventForm.get('date')?.setValue(this.formatDateForInput(tomorrow));
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      // Mark all fields as touched to trigger validation display
      Object.keys(this.eventForm.controls).forEach(key => {
        const control = this.eventForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const eventData: EventCreateDto = this.eventForm.value;

    // In production, use the actual service:
    /*
    this.eventsService.createEvent(eventData).subscribe({
      next: (createdEvent) => {
        this.router.navigate(['/events', createdEvent.id]);
      },
      error: (err) => {
        this.error = err.error?.error || 'An error occurred while creating the event. Please try again.';
        this.isSubmitting = false;
      }
    });
    */
    
    // For demonstration
    setTimeout(() => {
      console.log('Created event:', eventData);
      this.router.navigate(['/events']);
    }, 1000);
  }

  // Helper method to format date for the date input
  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}