// Type definitions for IISF Event Registration System

export interface TeamMember {
  name: string;
  gender: "Male" | "Female" | "Other";
  rollNumber: string;
  contactNumber: string;
  email: string;
}

export interface RegistrationData {
  eventName: string;
  participationType: "solo" | "team";
  teamName?: string;
  leaderName: string;
  leaderGender: "Male" | "Female" | "Other";
  leaderRollNumber: string;
  leaderContactNumber: string;
  leaderEmail: string;
  teamMembers: TeamMember[];
  createdAt?: Date;
  updatedAt?: Date;
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

export interface APIResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  details?: string[];
  data?: T;
  count?: number;
}

export interface RegistrationResponse {
  id: string;
  eventName: string;
  participationType: "solo" | "team";
  teamName?: string;
  leaderName: string;
  teamSize: number;
}

export interface Event {
  name: string;
  slug: string;
  description: string;
  date: string;
  maxTeamSize?: number;
  minTeamSize?: number;
  registrationDeadline?: string;
  isActive?: boolean;
}
