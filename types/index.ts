// Type definitions for IISF Event Registration System

// Participant interface matching the Participant model
export interface Participant {
  _id?: string;
  registrationId: string;
  name: string;
  gender: "Male" | "Female" | "Other";
  rollNumber: string;
  contactNumber: string;
  email: string;
  isLeader: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Registration interface matching the Registration model
export interface Registration {
  _id?: string;
  eventName: string;
  isTeam: boolean;
  teamName?: string;
  leaderEmail: string;
  totalParticipants: number;
  participants?: Participant[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Frontend form data interface (for RegistrationForm component)
export interface TeamMember {
  name: string;
  gender: "Male" | "Female" | "Other";
  rollNumber: string;
  contactNumber: string;
  email: string;
}

export interface RegistrationFormData {
  participationType: "solo" | "team";
  teamName?: string;
  leaderName: string;
  leaderGender: string;
  leaderRollNumber: string;
  leaderContactNumber: string;
  leaderEmail: string;
  teamMembers: TeamMember[];
}

// API Response interfaces
export interface APIResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  details?: string | string[];
  hint?: string;
  data?: T;
  count?: number;
}

export interface RegistrationResponse {
  registrationId: string;
  eventName: string;
  isTeam: boolean;
  teamName?: string;
  leaderName: string;
  totalParticipants: number;
  participantsCreated: number;
}

// Event interface (for future event management)
export interface Event {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  date: string;
  maxTeamSize?: number;
  minTeamSize?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
