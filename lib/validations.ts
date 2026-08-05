export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface TeamMember {
  name: string;
  gender: string;
  rollNumber: string;
  contactNumber: string;
  email: string;
}

export interface RegistrationData {
  participationType: "solo" | "team";
  teamName?: string;
  leaderName: string;
  leaderGender: string;
  leaderRollNumber: string;
  leaderContactNumber: string;
  leaderEmail: string;
  teamMembers?: TeamMember[];
}

export interface EventData {
  name: string;
  slug: string;
  description: string;
  date: string;
  image?: string;
  rulebook?: string;
  whatsappLink?: string;
  maxTeamSize?: number;
  minTeamSize?: number;
}

export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10}$/,
  SLUG: /^[a-z0-9-]+$/,
  ROLL_NUMBER: /^[0-9]{5}$/,
  DATE: /^\d{4}-\d{2}-\d{2}$/,
} as const;

export function isValidEmail(email: string): boolean {
  return PATTERNS.EMAIL.test(email?.trim() || "");
}

export function isValidPhone(phone: string): boolean {
  return PATTERNS.PHONE.test(phone?.trim() || "");
}

export function isValidSlug(slug: string): boolean {
  return PATTERNS.SLUG.test(slug?.trim() || "");
}

export function isValidDate(dateStr: string): boolean {
  if (!PATTERNS.DATE.test(dateStr?.trim() || "")) {
    return false;
  }
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isValidGender(gender: string): boolean {
  return ["Male", "Female", "Other", "male", "female", "other"].includes(
    gender,
  );
}

export function validateParticipant(
  data: {
    name?: string;
    gender?: string;
    rollNumber?: string;
    contactNumber?: string;
    email?: string;
  },
  label: string = "Participant",
): ValidationResult {
  if (!isNonEmptyString(data.name)) {
    return { isValid: false, error: `${label} name is required` };
  }

  if (data.name.length < 2 || data.name.length > 100) {
    return { isValid: false, error: `${label} name must be 2-100 characters` };
  }

  if (!isNonEmptyString(data.gender) || !isValidGender(data.gender)) {
    return {
      isValid: false,
      error: `${label} gender must be Male, Female, or Other`,
    };
  }

  if (!isNonEmptyString(data.rollNumber)) {
    return { isValid: false, error: `${label} roll number is required` };
  }

  if (!PATTERNS.ROLL_NUMBER.test(data.rollNumber.trim())) {
    return {
      isValid: false,
      error: `${label} roll number must be exactly 5 digits`,
    };
  }

  if (!isNonEmptyString(data.contactNumber)) {
    return { isValid: false, error: `${label} contact number is required` };
  }

  if (!isValidPhone(data.contactNumber)) {
    return {
      isValid: false,
      error: `${label} contact number must be 10 digits`,
    };
  }

  if (!isNonEmptyString(data.email)) {
    return { isValid: false, error: `${label} email is required` };
  }

  if (!isValidEmail(data.email)) {
    return { isValid: false, error: `${label} email is invalid` };
  }

  return { isValid: true };
}

export function validateRegistration(data: RegistrationData): ValidationResult {
  if (
    !data.participationType ||
    !["solo", "team"].includes(data.participationType)
  ) {
    return {
      isValid: false,
      error: 'participationType must be "solo" or "team"',
    };
  }

  const leaderValidation = validateParticipant(
    {
      name: data.leaderName,
      gender: data.leaderGender,
      rollNumber: data.leaderRollNumber,
      contactNumber: data.leaderContactNumber,
      email: data.leaderEmail,
    },
    "Leader",
  );

  if (!leaderValidation.isValid) {
    return leaderValidation;
  }

  const isTeam = data.participationType === "team";
  const teamMembers = data.teamMembers || [];

  if (isTeam) {
    if (!isNonEmptyString(data.teamName)) {
      return {
        isValid: false,
        error: "Team name is required for team participation",
      };
    }

    if (data.teamName.length < 3 || data.teamName.length > 100) {
      return { isValid: false, error: "Team name must be 3-100 characters" };
    }

    if (teamMembers.length < 1 || teamMembers.length > 5) {
      return {
        isValid: false,
        error: "Team requires 1-5 additional members (2-6 total)",
      };
    }

    for (let i = 0; i < teamMembers.length; i++) {
      const memberValidation = validateParticipant(
        teamMembers[i],
        `Team member ${i + 1}`,
      );
      if (!memberValidation.isValid) {
        return memberValidation;
      }
    }

    const allEmails = [
      data.leaderEmail.toLowerCase(),
      ...teamMembers.map((m) => m.email.toLowerCase()),
    ];
    const uniqueEmails = new Set(allEmails);
    if (uniqueEmails.size !== allEmails.length) {
      return {
        isValid: false,
        error: "Duplicate emails found in team members",
      };
    }
  } else {
    if (teamMembers.length > 0) {
      return {
        isValid: false,
        error: "Solo participation cannot have team members",
      };
    }
  }

  return { isValid: true };
}

export function validateEvent(data: EventData): ValidationResult {
  if (!isNonEmptyString(data.name)) {
    return { isValid: false, error: "Event name is required" };
  }

  if (!isNonEmptyString(data.slug)) {
    return { isValid: false, error: "Event slug is required" };
  }

  if (!isValidSlug(data.slug)) {
    return {
      isValid: false,
      error: "Slug can only contain lowercase letters, numbers, and hyphens",
    };
  }

  if (!isNonEmptyString(data.description)) {
    return { isValid: false, error: "Event description is required" };
  }

  if (!isNonEmptyString(data.date)) {
    return { isValid: false, error: "Event date is required" };
  }

  if (!isValidDate(data.date)) {
    return {
      isValid: false,
      error: "Invalid date format. Use YYYY-MM-DD (e.g., 2025-01-15)",
    };
  }

  if (
    data.maxTeamSize !== undefined &&
    (data.maxTeamSize < 1 || data.maxTeamSize > 10)
  ) {
    return { isValid: false, error: "Max team size must be between 1 and 10" };
  }

  if (
    data.minTeamSize !== undefined &&
    (data.minTeamSize < 1 || data.minTeamSize > 10)
  ) {
    return { isValid: false, error: "Min team size must be between 1 and 10" };
  }

  return { isValid: true };
}

export interface StartupData {
  name: string;
  slug: string;
  email: string;
  mobileNumber: string;
  incubatedDate: string;
  status: string;
  incubationDetails?: string;
  website?: string;
  image?: string;
}

const VALID_STATUSES = ["incubated", "non-incubated"];

export function validateStartup(data: StartupData): ValidationResult {
  if (!isNonEmptyString(data.name)) {
    return { isValid: false, error: "Startup name is required" };
  }

  if (data.name.length < 2 || data.name.length > 100) {
    return { isValid: false, error: "Startup name must be 2-100 characters" };
  }

  if (!isNonEmptyString(data.slug)) {
    return { isValid: false, error: "Startup slug is required" };
  }

  if (!isValidSlug(data.slug)) {
    return {
      isValid: false,
      error: "Slug can only contain lowercase letters, numbers, and hyphens",
    };
  }

  if (!isNonEmptyString(data.email)) {
    return { isValid: false, error: "Email is required" };
  }

  if (!isValidEmail(data.email)) {
    return { isValid: false, error: "Invalid email format" };
  }

  if (!isNonEmptyString(data.mobileNumber)) {
    return { isValid: false, error: "Mobile number is required" };
  }

  if (!isValidPhone(data.mobileNumber)) {
    return { isValid: false, error: "Mobile number must be 10 digits" };
  }

  if (!isNonEmptyString(data.incubatedDate)) {
    return { isValid: false, error: "Incubated date is required" };
  }

  if (!isValidDate(data.incubatedDate)) {
    return {
      isValid: false,
      error: "Invalid date format. Use YYYY-MM-DD (e.g., 2025-01-15)",
    };
  }

  if (!isNonEmptyString(data.status)) {
    return { isValid: false, error: "Status is required" };
  }

  if (!VALID_STATUSES.includes(data.status)) {
    return {
      isValid: false,
      error: `Status must be one of: ${VALID_STATUSES.join(", ")}`,
    };
  }

  return { isValid: true };
}
