import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor() { }

  handleError(error: HttpErrorResponse): void {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
      console.error('Client-side error:', errorMessage);
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}, Message: ${error.message}`;
      console.error('Server-side error:', errorMessage);
      
      if (error.error && typeof error.error === 'object') {
        console.error('Error details:', error.error);
      }
    }
    
    // You could implement a more sophisticated error handling here
    // For example, showing a notification or logging to a service
  }
}