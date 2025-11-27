# IISF Club Website - Event Registration API

A Next.js application for Innovation and Incubation Startup Foundation club event registrations with MongoDB integration.

## 🚀 Features

- **Event Registration API** (`/api/v1/form/:eventname`)
- **Solo and Team Participation** (Teams: 2-4 members)
- **MongoDB Database** with Mongoose ODM
- **Responsive Registration Form** with Tailwind CSS
- **Form Validation** (Frontend & Backend)
- **Duplicate Registration Prevention**

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account
- npm or yarn package manager

## 🛠️ Setup Instructions

### 1. Install Dependencies

Already done! Dependencies include:

- Next.js 15
- React 19
- Mongoose
- Tailwind CSS

### 2. Configure MongoDB

Edit `.env.local` file with your MongoDB connection string:

**For Local MongoDB:**

```env
MONGODB_URI=mongodb://localhost:27017/iisf-club
```

**For MongoDB Atlas:**

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/iisf-club?retryWrites=true&w=majority
```

### 3. Start MongoDB (if using local)

```bash
# Start MongoDB service
mongod
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/register` to see the registration form.

## 📁 Project Structure

```
iisf-web/
├── app/
│   ├── api/v1/form/[eventname]/route.ts   # API endpoint
│   ├── register/page.tsx                   # Registration page
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── RegistrationForm.tsx                # Registration form component
├── lib/
│   └── mongodb.ts                          # MongoDB connection utility
├── models/
│   └── Registration.ts                     # Mongoose schema
└── .env.local                              # Environment variables
```

## 🔌 API Documentation

### POST `/api/v1/form/:eventname`

Register a participant for an event.

**URL Parameters:**

- `eventname` - Name of the event (e.g., "hackathon-2025")

**Request Body:**

**Solo Participation:**

```json
{
  "participationType": "solo",
  "leaderName": "John Doe",
  "leaderGender": "Male",
  "leaderRollNumber": "21CS001",
  "leaderContactNumber": "9876543210",
  "leaderEmail": "john@example.com",
  "teamMembers": []
}
```

**Team Participation:**

```json
{
  "participationType": "team",
  "leaderName": "Jane Smith",
  "leaderGender": "Female",
  "leaderRollNumber": "21CS002",
  "leaderContactNumber": "9876543211",
  "leaderEmail": "jane@example.com",
  "teamMembers": [
    {
      "name": "Alice Johnson",
      "gender": "Female",
      "rollNumber": "21CS003",
      "contactNumber": "9876543212",
      "email": "alice@example.com"
    },
    {
      "name": "Bob Wilson",
      "gender": "Male",
      "rollNumber": "21CS004",
      "contactNumber": "9876543213",
      "email": "bob@example.com"
    }
  ]
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Registration successful!",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "eventName": "hackathon-2025",
    "participationType": "team",
    "leaderName": "Jane Smith",
    "teamSize": 3
  }
}
```

**Error Responses:**

- `400` - Validation error or invalid data
- `409` - Duplicate registration (email already registered for event)
- `500` - Server error

### GET `/api/v1/form/:eventname`

Fetch all registrations for an event (admin endpoint).

**Response:**

```json
{
  "success": true,
  "count": 25,
  "data": [...]
}
```

## 📊 Database Schema

### Registration Collection

```javascript
{
  eventName: String,              // Event name
  participationType: "solo"|"team",
  leaderName: String,
  leaderGender: "Male"|"Female"|"Other",
  leaderRollNumber: String,
  leaderContactNumber: String,    // 10 digits
  leaderEmail: String,
  teamMembers: [                  // 1-3 members for team
    {
      name: String,
      gender: String,
      rollNumber: String,
      contactNumber: String,
      email: String
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- Compound unique index on `(eventName, leaderEmail)` to prevent duplicates

## 🎨 Form Features

- **Participation Type Toggle:** Switch between solo and team
- **Dynamic Team Members:** Add/remove members (1-3 members)
- **Real-time Validation:** Email format, phone number (10 digits)
- **Responsive Design:** Works on mobile, tablet, and desktop
- **Error Handling:** User-friendly error messages
- **Success Feedback:** Confirmation message on successful registration

## 🔒 Validation Rules

- **Team Size:** 2-4 members (1 leader + 1-3 members)
- **Contact Number:** Exactly 10 digits
- **Email:** Valid email format
- **Gender:** Male, Female, or Other
- **Duplicate Prevention:** One registration per email per event

## 🚀 Deployment

### Environment Variables for Production

Set `MONGODB_URI` in your hosting platform:

- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables

### MongoDB Atlas Setup

1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get connection string and add to `.env.local`

## 📝 Usage Examples

### Testing the API with cURL

```bash
# Solo registration
curl -X POST http://localhost:3000/api/v1/form/hackathon-2025 \
  -H "Content-Type: application/json" \
  -d '{
    "participationType": "solo",
    "leaderName": "Test User",
    "leaderGender": "Male",
    "leaderRollNumber": "21CS999",
    "leaderContactNumber": "9999999999",
    "leaderEmail": "test@example.com",
    "teamMembers": []
  }'
```

### Using in Frontend

```typescript
const response = await fetch("/api/v1/form/hackathon-2025", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});

const result = await response.json();
```

## 🐛 Troubleshooting

**MongoDB Connection Error:**

- Verify MongoDB is running: `mongod --version`
- Check connection string in `.env.local`
- For Atlas: Verify IP whitelist and credentials

**API 404 Error:**

- Ensure dev server is running: `npm run dev`
- Check URL format: `/api/v1/form/event-name`

**Form Validation Errors:**

- Contact number must be exactly 10 digits
- Email must be valid format
- Team participation requires 1-3 members

## 📞 Support

For issues or questions about the IISF Club Website project, contact your development team.

## 🎯 Next Steps

- [ ] Add authentication for admin dashboard
- [ ] Create event management system
- [ ] Add email notifications
- [ ] Build analytics dashboard
- [ ] Implement event listing page
- [ ] Add payment integration (if needed)

---

Built with ❤️ for Innovation and Incubation Startup Foundation
