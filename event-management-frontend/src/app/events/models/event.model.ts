export interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    capacity: number;
    price: number;
    imageUrl?: string;
    organizerId: number;
    organizerName: string;
    category: string;
    status: 'draft' | 'published' | 'cancelled';
    createdAt: string;
    updatedAt: string;
  }
  
  export interface EventCreateDto {
    title: string;
    description: string;
    date: string;
    location: string;
    capacity: number;
    price: number;
    imageUrl?: string;
    category: string;
  }
  
  export interface EventUpdateDto extends EventCreateDto {
    status?: 'draft' | 'published' | 'cancelled';
  }