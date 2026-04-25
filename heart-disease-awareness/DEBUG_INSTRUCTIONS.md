# 🔧 Debug Instructions for Login Issues

## 🎯 **What I've Added:**

I've added a **Debug Panel** to the login page that will help us identify exactly what's wrong. 

## 🚀 **How to Test:**

### **Step 1: Start Both Servers**
```bash
# Terminal 1 - Backend
cd "d:/MY PROJECTS/ai-agents/prinsten/heart-disease-awareness-backend"
npm run dev

# Terminal 2 - Frontend
cd "d:/MY PROJECTS/ai-agents/prinsten/heart-disease-awareness"
npm start
```

### **Step 2: Open Debug Panel**
1. Go to `http://localhost:3000/login`
2. Scroll down to see the **"🔧 Debug Panel"** section
3. You'll see several test buttons

### **Step 3: Run Tests in Order**

#### **Test 1: Backend Connection**
- Click **"Test Backend"** button
- **Expected:** ✅ Backend connected message
- **If ❌:** Backend server isn't running

#### **Test 2: Admin Login**
- Click **"Test Admin Login"** button
- **Expected:** ✅ Admin login successful with token
- **If ❌:** Check admin credentials or backend auth

#### **Test 3: Create Test User**
- Set test email: `test@example.com`
- Set test password: `password123`
- Click **"Register User"** button
- **Expected:** ✅ User registration successful
- **If ❌:** Database connection issue or user already exists

#### **Test 4: User Login**
- Click **"Test User Login"** button
- **Expected:** ✅ User login successful
- **If ❌:** User doesn't exist or password wrong

#### **Test 5: Forgot Password**
- Click **"Test Forgot PW"** button
- **Expected:** ✅ Forgot password successful
- **If ❌:** Database issue or user doesn't exist

#### **Test 6: Check Auth Context**
- Click **"Check Auth"** button
- **Expected:** Shows current auth state
- **If empty:** AuthContext not working

## 🔍 **What to Look For:**

### **✅ Success Indicators:**
- Green checkmarks (✅) in debug results
- "Backend connected" message
- "Login successful" with token and user data
- "AuthContext state" shows user and token

### **❌ Error Indicators:**
- Red X marks (❌) in debug results
- "Backend connection failed"
- "Login failed" messages
- Empty or undefined responses

## 🛠️ **Common Issues & Solutions:**

### **Issue 1: Backend Not Running**
**Symptom:** "Backend connection failed"
**Solution:** Make sure backend server is running on port 5000

### **Issue 2: CORS Error**
**Symptom:** Network error in browser console
**Solution:** Backend CORS should allow `http://localhost:3000`

### **Issue 3: Database Not Connected**
**Symptom:** "Internal server error" from backend
**Solution:** Check MongoDB connection in backend

### **Issue 4: User Already Exists**
**Symptom:** "User with this email already exists"
**Solution:** Use different test email or clear database

### **Issue 5: Wrong Admin Credentials**
**Symptom:** "Invalid admin credentials"
**Solution:** Use exact: `admin@heartdisease.com` / `Admin@2024!Secure`

## 📋 **Test Results to Share:**

Please run the tests and share:
1. **Backend Connection** result
2. **Admin Login** result (full response)
3. **User Registration** result (full response)
4. **User Login** result (full response)
5. **Forgot Password** result (full response)
6. **Auth Context** state

## 🎯 **Expected Full Success Flow:**

```
✅ Backend connected: {"message":"Heart Disease Awareness System API"}
✅ Admin login successful: {"success":true,"token":"eyJ...","user":{"id":"admin",...}}
✅ User registration successful: {"success":true,"token":"eyJ...","user":{"id":"..."}}
✅ User login successful: {"success":true,"token":"eyJ...","user":{"id":"..."}}
✅ Forgot password successful: {"success":true,"resetLink":"http://..."}
AuthContext state:
  User: {"id":"...","username":"...","email":"...","role":"..."}
  Token: exists
```

## 🔧 **If Tests Fail:**

### **Backend Issues:**
- Check backend console for errors
- Verify MongoDB is running
- Check environment variables

### **Frontend Issues:**
- Check browser console for errors
- Verify API URL is correct
- Check network tab for failed requests

### **Database Issues:**
- Clear existing test users
- Check MongoDB connection string
- Verify User model schema

## 🚀 **Next Steps:**

1. **Run the debug tests**
2. **Share the results** (copy all debug output)
3. **I'll identify the exact issue** and fix it
4. **Remove debug panel** once everything works

**This will help us pinpoint exactly what's wrong with the login and forgot password functionality!** 🔧🐛
