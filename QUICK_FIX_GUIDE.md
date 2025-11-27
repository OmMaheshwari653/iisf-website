# Quick Fix Guide - Registration Bug

## ✅ Fixes Applied

### 1. MongoDB Connection String Fixed
- **Issue**: Missing `mongodb://` protocol
- **Fixed**: Changed `localhost:27017` to `mongodb://localhost:27017/iisf-club`

### 2. Enhanced Error Logging
Added detailed console logs to track:
- MongoDB connection status
- API request details
- Registration creation process
- Full error stack traces

### 3. Better Error Display
- Form now shows complete error messages
- Includes hints for common issues
- MongoDB connection errors are clearly displayed

## 🔍 How to Debug

### Step 1: Start Dev Server
```powershell
npm run dev
```

### Step 2: Open Browser Console
- Go to http://localhost:3000
- Press F12 to open Developer Tools
- Go to Console tab

### Step 3: Try Registration
Fill the form and submit. You'll see detailed logs like:
```
📝 Registration API called
✅ Database connected
📍 Event name: hackathon-2025
📦 Request body: {...}
💾 Creating registration...
✅ Registration created: 507f1f77bcf86cd799439011
```

### Step 4: Check Terminal Logs
Watch the terminal where `npm run dev` is running for:
- MongoDB connection messages
- Error details if any

## 🐛 Common Issues & Solutions

### Issue 1: MongoDB Not Connected
**Error**: `MongooseServerSelectionError`

**Solution**:
```powershell
# Check MongoDB service status
Get-Service MongoDB

# If stopped, start it
Start-Service MongoDB
```

### Issue 2: Database Permission Issues
**Solution**: Make sure MongoDB is running without authentication, or add credentials to `.env.local`

### Issue 3: Port Already in Use
**Error**: `EADDRINUSE`

**Solution**:
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

## 📊 Verify Data in MongoDB Compass

1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Look for database: `iisf-club`
4. Check collection: `registrations`
5. You should see your registered data

## 🎯 Test Checklist

- [ ] MongoDB service is running
- [ ] Dev server is running (`npm run dev`)
- [ ] Browser console shows no errors
- [ ] Form submission shows success message
- [ ] Data appears in MongoDB Compass
- [ ] Console logs show "✅ Registration created"

## 📞 Still Having Issues?

Check these logs:
1. **Browser Console** (F12) - Frontend errors
2. **Terminal** - Backend/API errors
3. **MongoDB Compass** - Database connectivity

All errors will now show detailed messages with hints!
