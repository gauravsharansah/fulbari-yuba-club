# 🏆 Fulbari Yuba Club Jakma — Official Website

**फुलबारी युवा क्लव जाक्मा** | Full-Stack Web Application

---

## 📁 Project Structure

```
fyc-jakma/
├── backend/                  # Node.js + Express + MongoDB API
│   ├── config/
│   │   ├── cloudinary.js     # Image upload config
│   │   └── seed.js           # Admin user seeder
│   ├── middleware/
│   │   └── auth.js           # JWT auth middleware
│   ├── models/
│   │   ├── User.js           # User/Member model
│   │   ├── Program.js        # Event/Program model
│   │   └── Other.js          # Blog, Certificate, Gallery, Contact
│   ├── routes/
│   │   ├── auth.js
│   │   ├── programs.js
│   │   ├── blogs.js
│   │   ├── certificates.js
│   │   ├── members.js
│   │   ├── gallery.js
│   │   └── contact.js
│   ├── server.js
│   ├── package.json
│   ├── vercel.json
│   └── .env.example
│
├── frontend/                 # React.js SPA
│   ├── public/
│   │   ├── index.html        # Has logo favicon wired in
│   │   └── logo.png          # ← PLACE YOUR LOGO HERE
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── Footer.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── AboutPage.js
│   │   │   ├── ProgramsPage.js
│   │   │   ├── AwardsPage.js
│   │   │   ├── BlogPage.js
│   │   │   ├── OtherPages.js  # Gallery, Team, Contact
│   │   │   ├── LoginPage.js
│   │   │   └── AdminPage.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── vercel.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## 🖼️ Logo Setup (IMPORTANT — Do This First)

1. Copy your club logo file and rename it to `logo.png`
2. Place it at: `frontend/public/logo.png`
3. That's it — it will automatically appear in:
   - Browser tab (favicon)
   - Navbar
   - Footer
   - Hero section
   - About page
   - Login page

---

## 🚀 Complete Setup Guide

### Prerequisites

Make sure you have these installed:

```bash
node --version    # v18 or higher required
npm --version     # v9 or higher
git --version     # any recent version
```

If not installed:
- **Node.js**: https://nodejs.org (download LTS version)
- **Git**: https://git-scm.com

---

## STEP 1 — MongoDB Atlas Setup

1. Go to https://mongodb.com/atlas and create a free account
2. Click **"Build a Database"** → Choose **FREE (M0 Sandbox)**
3. Choose **AWS** provider, region closest to Nepal (Singapore recommended)
4. Set **Username** and **Password** (save these!)
5. Under **Network Access** → click **"Add IP Address"** → select **"Allow Access from Anywhere"** (0.0.0.0/0)
6. Under **Database** → click **"Connect"** → **"Connect your application"**
7. Copy the connection string that looks like:
   ```
   mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
8. Replace `<password>` with your actual password and add database name:
   ```
   mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/fyc-jakma?retryWrites=true&w=majority
   ```

---

## STEP 2 — Cloudinary Setup (for image uploads)

1. Go to https://cloudinary.com and create a free account
2. From your Dashboard, copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
3. You'll use these in the backend `.env` file

---

## STEP 3 — Clone / Setup Repository

```bash
# If pushing existing code to GitHub first:
git init
git add .
git commit -m "Initial commit: FYC Jakma website"

# Create a new repo at github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/fyc-jakma.git
git branch -M main
git push -u origin main
```

---

## STEP 4 — Backend Local Setup

```bash
# Navigate to backend folder
cd fyc-jakma/backend

# Install dependencies
npm install

# Create your .env file from the example
cp .env.example .env
```

Now open `backend/.env` and fill in all values:

```env
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/fyc-jakma?retryWrites=true&w=majority
JWT_SECRET=FYCJakmaSecretKey2057ChangeThisToSomethingLong!
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_api_secret_here
FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=admin@fycjakma.com
ADMIN_PASSWORD=FYC@Admin2057!
```

```bash
# Run backend in development mode
npm run dev

# You should see:
# ✅ MongoDB Connected
# ✅ Admin user seeded
# 🚀 Server running on port 5000
```

Test the API is working:
```
http://localhost:5000/api/health
```
Should return: `{"success":true,"message":"FYC Jakma API is running"}`

---

## STEP 5 — Frontend Local Setup

```bash
# Open a NEW terminal tab/window
cd fyc-jakma/frontend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
```

Open `frontend/.env` and set:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

```bash
# Place your logo
cp /path/to/your/logo.png public/logo.png

# Start the React development server
npm start

# Browser opens automatically at:
# http://localhost:3000
```

---

## STEP 6 — Test Login Locally

- **Member login**: Use the registered member credentials  
- **Admin login**: `admin@fycjakma.com` / `FYC@Admin2057!`  
  → Goes to `/admin` dashboard

---

## STEP 7 — Deploy Backend to Vercel

### 7a. Install Vercel CLI

```bash
npm install -g vercel
vercel login   # follow the prompts, login with your Vercel account
```

### 7b. Deploy Backend

```bash
cd fyc-jakma/backend
vercel
```

Answer the prompts:
```
? Set up and deploy? Yes
? Which scope? (your account)
? Link to existing project? No
? Project name: fyc-jakma-backend
? In which directory is your code located? ./
? Want to override settings? No
```

### 7c. Add Backend Environment Variables on Vercel

Go to https://vercel.com → your `fyc-jakma-backend` project → **Settings** → **Environment Variables**

Add ALL of these (for Production, Preview, AND Development):

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/fyc-jakma?retryWrites=true&w=majority` |
| `JWT_SECRET` | `FYCJakmaSecretKey2057ChangeThisToSomethingLong!` |
| `JWT_EXPIRE` | `7d` |
| `PORT` | `5000` |
| `NODE_ENV` | `production` |
| `CLOUDINARY_CLOUD_NAME` | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | `your_api_key` |
| `CLOUDINARY_API_SECRET` | `your_api_secret` |
| `FRONTEND_URL` | `https://fyc-jakma.vercel.app` ← update after frontend deploy |
| `ADMIN_EMAIL` | `admin@fycjakma.com` |
| `ADMIN_PASSWORD` | `FYC@Admin2057!` |

### 7d. Redeploy Backend (to apply env vars)

```bash
cd backend
vercel --prod
```

Copy your backend URL — it looks like:
```
https://fyc-jakma-backend.vercel.app
```

Test it:
```
https://fyc-jakma-backend.vercel.app/api/health
```

---

## STEP 8 — Deploy Frontend to Vercel

### 8a. Update Frontend `.env` with production API URL

```env
REACT_APP_API_URL=https://fyc-jakma-backend.vercel.app/api
```

### 8b. Deploy Frontend

```bash
cd fyc-jakma/frontend
vercel
```

Prompts:
```
? Project name: fyc-jakma
? Directory: ./
? Override settings? No
```

### 8c. Add Frontend Environment Variable on Vercel

Go to Vercel → `fyc-jakma` (frontend) project → **Settings** → **Environment Variables**:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://fyc-jakma-backend.vercel.app/api` |

### 8d. Build and Deploy Frontend

```bash
vercel --prod
```

Your frontend URL will be:
```
https://fyc-jakma.vercel.app
```

### 8e. Update Backend CORS with Frontend URL

Go back to Vercel → `fyc-jakma-backend` → Settings → Environment Variables

Update:
```
FRONTEND_URL = https://fyc-jakma.vercel.app
```

Then redeploy backend:
```bash
cd backend
vercel --prod
```

---

## STEP 9 — Push All Changes to GitHub

```bash
# From the root fyc-jakma/ folder
git add .
git commit -m "feat: complete FYC Jakma website with admin portal"
git push origin main
```

---

## 🔐 Admin Credentials

| Field | Value |
|-------|-------|
| Email | `admin@fycjakma.com` |
| Password | `FYC@Admin2057!` |
| URL | `yoursite.vercel.app/login?tab=admin` |

**Important**: Change these in your `.env` before going live!

---

## 🌐 All Pages

| Page | URL |
|------|-----|
| Home | `/` |
| About | `/about` |
| Programs | `/programs` |
| Awards | `/awards` |
| Blog | `/blog` |
| Gallery | `/gallery` |
| Team | `/team` |
| Contact | `/contact` |
| Login | `/login` |
| Admin | `/admin` |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login (member or admin) |
| POST | `/api/auth/register` | Register new member |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/auth/users` | Get all users (admin) |
| POST | `/api/auth/users` | Add member (admin) |

### Programs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/programs` | Get all programs |
| GET | `/api/programs?category=tournament` | Filter by category |
| POST | `/api/programs` | Create program (admin) |
| PUT | `/api/programs/:id` | Update program (admin) |
| DELETE | `/api/programs/:id` | Delete program (admin) |

### Blogs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blogs` | Get published blogs |
| GET | `/api/blogs/all` | Get all blogs (admin) |
| POST | `/api/blogs` | Create blog (admin) |
| DELETE | `/api/blogs/:id` | Delete blog (admin) |

### Certificates
| GET/POST/DELETE | `/api/certificates` | Manage awards |

### Gallery
| GET/POST/DELETE | `/api/gallery` | Manage photos |

### Contact
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact` | Submit message (public) |
| GET | `/api/contact` | View messages (admin) |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6 |
| Styling | CSS-in-JS (inline + global CSS) |
| Backend | Node.js, Express 4 |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Images | Cloudinary |
| Deployment | Vercel (both frontend & backend) |
| Font | Plus Jakarta Sans (Google Fonts) |

---

## 🛠️ Development Commands

```bash
# Backend development
cd backend && npm run dev

# Frontend development  
cd frontend && npm start

# Build frontend for production
cd frontend && npm run build

# Deploy backend to production
cd backend && vercel --prod

# Deploy frontend to production
cd frontend && vercel --prod
```

---

## ❓ Troubleshooting

### "CORS error" on deployed site
→ Make sure `FRONTEND_URL` in backend env variables matches your exact frontend URL (no trailing slash)

### "Cannot connect to MongoDB"
→ Check MongoDB Atlas → Network Access → make sure `0.0.0.0/0` is in the IP whitelist

### "Module not found" on Vercel
→ Run `npm install` locally, commit `package.json` changes, redeploy

### Images not uploading
→ Check Cloudinary credentials in backend env vars

### Logo not showing
→ Make sure file is named exactly `logo.png` (lowercase) in `frontend/public/`

### Admin login not working on production
→ Redeploy backend after setting env vars — the admin seed runs on first connection

---

## 📞 Club Contact

- 📍 Jakma, Manyavangyag Gaun Palika-6, Okhaldhunga, Nepal — 56100
- 📘 Facebook: [fulbariyubaclub](https://facebook.com/fulbariyubaclub)
- 📊 434 Followers · 91 Posts

---

*Built for Fulbari Yuba Club — Est. 2057 BS 🇳🇵*
