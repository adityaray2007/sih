# 🌪️ Disaster Preparedness & Response Education System  
### For Schools & Colleges — SIH Project  
Built with **Next.js, MongoDB, Leaflet Maps, Role-based Auth, Real-Time Alerts, Quizzes, Modules & Accessibility Support**

---

## 🚀 Overview  
This project is a **comprehensive disaster-preparedness education platform** designed for **students, teachers, and administrators**.  
It provides **interactive learning modules, real-time alerts, quizzes, dashboards, accessibility modes**, and more — all in one web-based system.

---

## 🛠️ Tech Stack  
### **Frontend**
- Next.js 15 (App Router)
- React 18
- TypeScript  
- Tailwind CSS  
- Leaflet.js (Live weather + disaster maps)  
- Heroicons  

### **Backend**
- Next.js API Routes  
- MongoDB Atlas  
- Mongoose ORM  
- JWT Authentication  
- NextAuth.js (Google Login)  
- bcryptjs (password hashing)  
- rss-parser (GDACS + ReliefWeb disaster alerts)

### **Database**
MongoDB Collections:
- **users** → role, xp, completed modules  
- **modules** → disaster safety modules  
- **quizzes** → quiz data  
- **alerts** → disaster alerts  

---

## 🔐 User Roles  
| Role | Access |
|------|--------|
| **Student** | Modules, quizzes, weather map, alerts, dashboard |
| **Teacher** | Create modules, quizzes, send alerts |
| **Admin** | Dashboard + teacher privileges |

---

## 🌟 Key Features

### ✔️ Role-Based Login  
Secure login with email or Google OAuth.

### ✔️ Student Dashboard  
Shows XP, completed modules, time graph, top performers, drills & more.

### ✔️ Disaster Modules  
Interactive modules with images, content & XP rewards.

### ✔️ Quizzes  
MCQs with images, scoring, XP, and instant feedback.

### ✔️ Real-Time Weather Map  
Leaflet + OpenWeather overlays.

### ✔️ Disaster Alert Feeds  
GDACS + ReliefWeb + OpenWeather alerts → shown in notifications.

### ✔️ Alert Control Panel for Teachers  
Send alerts to all students.

### ✔️ Accessibility  
TTS, captions, and vibration feedback for:
- Blind  
- Deaf  
- Blind+Deaf users  

---

## 📂 Project Structure  
```
sih/
├── app/
│   ├── api/
│   ├── dashboard/
│   ├── modules/
│   ├── quizzes/
│   ├── alerts/
│   ├── weather/
│   ├── login/
│   ├── signup/
│   └── page.tsx
│
├── models/
├── lib/
├── public/
├── .env.local
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repo
```
git clone https://github.com/your-username/sih.git
cd sih
```

### 2️⃣ Install Dependencies
```
npm install
```

### 3️⃣ Environment Variables  
Create `.env.local`:
```
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=xxxx
GOOGLE_CLIENT_SECRET=xxxx
NEXTAUTH_SECRET=xxxx
NEXT_PUBLIC_OPENWEATHER_KEY=xxxx
```

### 4️⃣ Run Project  
```
npm run dev
```

---

## 🧪 Testing  
- Login  
- Create modules  
- Create quizzes  
- Test alerts  
- Check dashboard data  

---

# 💫 Built With ❤️ By Detectives  
Made with ☕, 🤝 teamwork, and a lot of 🚀 innovation.

### 👥 Team Members  
- **Aditya Ray** — Full Stack Developer & System Architect (Team Lead)  
- **Akarsh Tyagi** — Backend Developer & Auth Systems  
- **Shantanu Kumar** — Frontend UI/UX Developer  
- **Aditya Sinha** — Backend + Database Management  
- **Aditya Ray** — API Integrations & Testing  

### 🎓 Mentor  
**[Mentor Name]**, Assistant Professor  
Bennett University  

---

> *"Empowering students today for a safer tomorrow."*
