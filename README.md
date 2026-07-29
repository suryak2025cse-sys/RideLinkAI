# RideLink AI 🚗⚡

> **AI-Powered Community-Based Last-Mile Ride Sharing Platform**

RideLink AI is a production-ready MERN Stack application integrated with a Python AI Microservice. It connects verified drivers and passengers traveling on similar routes across college campuses, corporate parks, residential communities, and daily commuter hubs using AI-powered ride matching, smart routing, dynamic trust scores, and real-time safety monitoring.

---

## 🌟 Key Features & Modules

1. **AI Ride Matching Engine**: Multi-attribute ranking based on pickup proximity, route overlap %, time compatibility, driver trust score, seat availability, and gender preferences.
2. **Dynamic AI Trust Score (0 - 100)**: Evaluates identity verifications (Aadhaar, Driving License, College ID), star ratings, completion rates, and ride behavior metrics (e.g. `94/100 Highly Trusted`).
3. **Ride Guardian & Emergency SOS**: Continuous telemetry monitoring for route deviations and long stationary stops, route divergence safety popups, and 1-tap Emergency SOS dispatch.
4. **Women Safety Mode**: Dedicated portal featuring female-only rides, verified female drivers badge, priority matching, and enhanced safety alerts.
5. **Community Modes**: Tailored verification logic and domain restrictions for Campus Mode (`@univ.edu`), Corporate Mode (`@company.com`), Residential Communities, and Open Rides.
6. **Real-time Engine (Socket.io)**: Live GPS location streaming, interactive maps (Leaflet / Google Maps ready), driver pings, and real-time chat with typing indicators and read receipts.
7. **Razorpay & Wallet Integration**: Instant wallet topup, UPI, Card payments, automated ride receipts, and refund handling.
8. **Carbon Impact Dashboard**: Real-time environmental tracking showing Fuel Saved (L), CO₂ Offset (kg), Shared Trips, and Tree Equivalents.
9. **Admin & Campus Analytics**: Interactive Chart.js dashboards monitoring daily rides, revenue growth, driver verifications, demand heatmaps, and active SOS emergencies.

---

## 🏗️ Architecture & Tech Stack

```
RideLink AI Monorepo
│
├── client/           # React 19, Vite, Tailwind CSS, Redux Toolkit, Framer Motion, Leaflet Maps, Chart.js, Socket.io
├── server/           # Node.js, Express.js, MongoDB/Mongoose, Socket.io, JWT, Razorpay SDK
└── ai_service/       # Python 3.10 (Flask REST API, numpy, geopy matching & trust algorithms)
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+) & npm
- Python (v3.10+) & pip
- MongoDB running locally or MongoDB Atlas connection string
- Docker & Docker Compose (optional for containerized setup)

---

### Step 1: Clone & Setup Environment Variables

#### Backend Server (`server/.env`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ridelink_ai
JWT_SECRET=ridelink_super_secret_jwt_key_2026
PYTHON_AI_URL=http://127.0.0.1:5001
RAZORPAY_KEY_ID=rzp_test_ridelink123
RAZORPAY_KEY_SECRET=ridelink_secret_key_456
```

---

### Step 2: Install & Run Python AI Microservice

```bash
cd ai_service
pip install -r requirements.txt
python app.py
```
*Microservice runs on `http://localhost:5001`*

---

### Step 3: Install & Run Express Backend Service

```bash
cd server
npm install

# Seed Initial Test Data (Students, Drivers, Rides, Communities)
npm run seed

# Run Server in Dev Mode
npm run dev
```
*Backend runs on `http://localhost:5000`*

---

### Step 4: Install & Run Frontend Client

```bash
cd client
npm install
npm run dev
```
*Frontend app runs on `http://localhost:3000`*

---

## 🐳 Docker Deployment (Single Command)

Run the entire application stack (MongoDB, Node Server, Python AI Microservice, and React Frontend) with Docker Compose:

```bash
docker-compose up --build
```

---

## ☁️ Cloud Deployment Guide

### 1. MongoDB Atlas (Database)
1. Create a free M0 Cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Add Database User and allow IP Access (`0.0.0.0/0`).
3. Copy Connection String: `mongodb+srv://<user>:<password>@cluster.mongodb.net/ridelink_ai?retryWrites=true&w=majority`.

### 2. Render Deployment (Backend & Python AI Service)
1. **Python AI Service**:
   - Create a Web Service on Render pointing to `./ai_service`.
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app -b 0.0.0.0:5001`
2. **Node.js Express Backend**:
   - Create a Web Service pointing to `./server`.
   - Environment Variables: Add `MONGO_URI` (Atlas URL), `JWT_SECRET`, `PYTHON_AI_URL` (Render Python URL).
   - Build Command: `npm install`
   - Start Command: `npm start`

### 3. Vercel Deployment (React Frontend)
1. Import `./client` directory into Vercel.
2. Framework Preset: **Vite**.
3. Output Directory: `dist`.
4. Deploy!

---

## 📦 Deliverables Summary

- [x] Full MERN Source Code (`server/`, `client/`)
- [x] Python AI Microservice (`ai_service/`)
- [x] Responsive Glassmorphic UI with Dark/Light Theme
- [x] 13 Mongoose Schemas & Database Seeder (`seed.js`)
- [x] Socket.io Real-time Location Tracking & Live Chat
- [x] Razorpay Payment & Wallet Integration
- [x] Postman API Collection (`RideLink_AI.postman_collection.json`)
- [x] Docker & Docker Compose setup (`docker-compose.yml`)
