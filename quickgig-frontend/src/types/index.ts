export interface User {
  id: string;
  email: string;
  name: string;
  role: 'seeker' | 'poster';
  avatar?: string;
  bio?: string;
  skills?: string[];
  location?: string;
  rating?: number;
  completedGigs?: number;
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  category: string;
  pay: number;
  payType: 'hourly' | 'fixed';
  duration: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  posterId: string;
  posterName: string;
  posterRating?: number;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  applicants?: Application[];
  createdAt: string;
  startDate?: string;
  endDate?: string;
  tags?: string[];
}

export interface Application {
  id: string;
  gigId: string;
  seekerId: string;
  seekerName: string;
  seekerRating?: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  appliedAt: string;
  message?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'application' | 'acceptance' | 'rejection' | 'payment' | 'message';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedId?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  gigId?: string;
  message: string;
  timestamp: string;
  read: boolean;
}
