# IISF Website - Quick Start Guide

## ✅ What Has Been Created

### Backend (API)

✅ MongoDB connection utility (`lib/mongodb.ts`)
✅ Mongoose Registration model (`models/Registration.ts`)
✅ API endpoint `/api/v1/form/[eventname]` with POST and GET methods
✅ Full validation and error handling

### Frontend

✅ Dynamic registration form component (`components/RegistrationForm.tsx`)
✅ Registration page with event parameter (`app/register/[eventname]/page.tsx`)
✅ Homepage with event listings (`app/page.tsx`)
✅ Responsive design with Tailwind CSS

### Features Implemented

✅ Solo and Team participation options
✅ Team size validation (2-4 members including leader)
✅ Dynamic "Add Member" button (max 3 additional members)
✅ Form validation (email, 10-digit phone, gender selection)
✅ Duplicate registration prevention
✅ Success/Error messaging
✅ Mobile-responsive design

## 🚀 How to Run

### Step 1: Install MongoDB (if not already installed)

**Option A: Local MongoDB**

- Download from: https://www.mongodb.com/try/download/community
- Install and start the service

**Option B: MongoDB Atlas (Cloud)**

- Create free account: https://www.mongodb.com/cloud/atlas
- Create cluster and get connection string
- Update `.env.local` with your connection string

### Step 2: Configure Environment Variables

The `.env.local` file has been created. Update it if needed:

```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/iisf-club

# OR for MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/iisf-club
```

### Step 3: Start Development Server

```bash
npm run dev
```

### Step 4: Test the Application

1. **Homepage**: http://localhost:3000

   - View all events
   - Click "Register Now" on any event

2. **Registration Pages**:

   - http://localhost:3000/register/hackathon-2025
   - http://localhost:3000/register/startup-pitch-2025
   - http://localhost:3000/register/innovation-workshop
   - http://localhost:3000/register/tech-talk-2025

3. **Test Solo Registration**:

   - Select "Solo Participation"
   - Fill leader details
   - Submit

4. **Test Team Registration**:
   - Select "Team Participation"
   - Fill leader details
   - Click "Add Member" (1-3 times)
   - Fill team member details
   - Submit

## 📝 API Testing

### Using cURL (PowerShell)

**Solo Registration:**

```powershell
$body = @{
    participationType = "solo"
    leaderName = "John Doe"
    leaderGender = "Male"
    leaderRollNumber = "21CS001"
    leaderContactNumber = "9876543210"
    leaderEmail = "john@example.com"
    teamMembers = @()
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/v1/form/hackathon-2025" -Method Post -Body $body -ContentType "application/json"
```

**Team Registration:**

```powershell
$body = @{
    participationType = "team"
    leaderName = "Jane Smith"
    leaderGender = "Female"
    leaderRollNumber = "21CS002"
    leaderContactNumber = "9876543211"
    leaderEmail = "jane@example.com"
    teamMembers = @(
        @{
            name = "Alice"
            gender = "Female"
            rollNumber = "21CS003"
            contactNumber = "9876543212"
            email = "alice@example.com"
        }
    )
} | ConvertTo-Json -Depth 3

Invoke-RestMethod -Uri "http://localhost:3000/api/v1/form/hackathon-2025" -Method Post -Body $body -ContentType "application/json"
```

**Get All Registrations:**

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/form/hackathon-2025" -Method Get
```

## 📊 Database Structure

### Collections Created (automatically)

- `registrations` - Stores all event registrations

### Indexes

- Compound unique index on `(eventName, leaderEmail)` prevents duplicate registrations

## 🎯 URLs and Routes

| Page         | URL                        | Description                      |
| ------------ | -------------------------- | -------------------------------- |
| Homepage     | `/`                        | Event listings                   |
| Registration | `/register/[eventname]`    | Event-specific registration form |
| API POST     | `/api/v1/form/[eventname]` | Submit registration              |
| API GET      | `/api/v1/form/[eventname]` | Get all registrations            |

## 🔍 Key Files to Understand

1. **`models/Registration.ts`** - Database schema and validation rules
2. **`app/api/v1/form/[eventname]/route.ts`** - API logic
3. **`components/RegistrationForm.tsx`** - Form component
4. **`lib/mongodb.ts`** - Database connection

## ✨ Features You Can Test

1. **Solo Registration** ✅
2. **Team Registration (2-4 members)** ✅
3. **Dynamic Add/Remove Members** ✅
4. **Form Validation** ✅
5. **Duplicate Prevention** (try registering with same email twice) ✅
6. **Responsive Design** (test on mobile, tablet, desktop) ✅
7. **Success/Error Messages** ✅

## 🛠️ Troubleshooting

### "Cannot connect to MongoDB"

- Check if MongoDB is running: `mongod --version`
- Verify connection string in `.env.local`
- For Atlas: Check network access settings

### "API 404 Error"

- Ensure dev server is running: `npm run dev`
- Check console for build errors

### "Module not found"

- Run: `npm install`

## 📱 Next Features to Add (Optional)

- [ ] Email verification
- [ ] Payment integration
- [ ] Admin dashboard
- [ ] Certificate generation
- [ ] Analytics and reporting
- [ ] Event calendar
- [ ] User authentication

## 🎉 You're All Set!

Visit http://localhost:3000 and start testing your IISF website!

For detailed API documentation, see `API_README.md`
