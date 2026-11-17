# 🩺 Doctor Appointment & Practice Management System

> 🔗 **Live Deployment:** [https://health-appointment-app-liart.vercel.app](https://health-appointment-app-liart.vercel.app/)

A full-stack, production-ready Healthcare Web Application and Admin Management Portal built with the **MERN** stack (MongoDB, Express.js, React, Node.js). 

This system allows patients to learn about the doctor, explore medical specialties and treatments, read articles, and seamlessly **book appointments for checkups online**.

---

## 🌟 Key Highlights

- **100% Dynamic Content via Admin Dashboard:** Every piece of website content—doctor bio, qualifications, experience, clinic timings, specialties, treatments, health articles, FAQs, and testimonials—can be dynamically created, updated, and managed by the admin without editing any code.
- **Online Patient Appointment Booking:** Patients can request a checkup anytime by selecting their preferred date, entering symptoms/reasons, and providing their contact details.
- **Automated Dual-Email Notifications:**
  - **Patient Confirmation:** The patient instantly receives a branded HTML confirmation email with appointment request details and clinic instructions.
  - **Doctor / Admin Alert:** The doctor/admin instantly receives an alert email with full patient details (name, email, phone number, preferred checkup date, and message).
- **Interactive Modern Experience:** Built with custom 3D particle backgrounds, smooth scrolling, responsive layouts, and an administrative control panel.

---

## 🚀 Features

### 👤 Patient & Public Portal
- **Doctor Overview & Credentials:** Doctor credentials, qualifications, experience years, and awards.
- **Specialties & Procedures:** Detailed medical services categorized by department.
- **Appointment Booking:** Intuitive appointment modal with real-time feedback.
- **Patient Reviews:** Real verified patient testimonials with ratings.
- **Health Articles & Blog:** Health advice and articles published directly by the clinic.
- **Interactive FAQ:** Common patient queries with collapsible accordions.
- **Contact & Inquiries:** Inquiry form and newsletter subscription.

### 🛡️ Admin Management Dashboard
- **Secure Authentication:** Protected login with JWT and password recovery.
- **📅 Appointment Management:** 
  - Real-time list of all patient appointment bookings.
  - Filter by status: `Pending`, `Confirmed`, `Completed`, `Cancelled`.
  - View full patient contact details, checkup dates, and health symptoms.
- **👨‍⚕️ Doctor Profile Customizer:** Update doctor details, contact info, clinic timings, and stats on the fly.
- **🩺 Specialties & Treatments:** Add or update available treatments, procedures, and medical departments.
- **📝 Health Articles (CMS):** Publish, update, or unpublish medical blog articles.
- **💬 Reviews & FAQ Manager:** Moderate patient testimonials and keep clinic FAQs up to date.
- **📬 Subscriber Management:** View newsletter subscribers.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, CSS Modules, Three.js Particle Canvas, Lenis Smooth Scroll
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, BcryptJS
- **Email Service:** Nodemailer (Gmail SMTP with responsive HTML email templates)

---

## 📁 Repository Structure

```text
Health-Appointment/
├── doctor-frontend/            # React Vite Client Application
│   ├── src/
│   │   ├── components/         # Modals, layout, 3D particles, common UI
│   │   ├── pages/              # Public pages & Admin Dashboard
│   │   ├── services/           # API integration
│   │   └── context/            # Global state & auth context
│   └── package.json
│
├── doctor-B/                   # Express.js Backend API
│   ├── src/
│   │   ├── config/             # Database connection & CORS
│   │   ├── controller/         # API controllers
│   │   ├── models/             # Mongoose database schemas
│   │   ├── routes/             # API routes
│   │   ├── services/           # Nodemailer email notification service
│   │   └── templates/          # HTML email templates
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

## 📧 Appointment Email Workflow

```text
[ Patient Books Appointment ]
             │
             ├──► Saved to Database (Status: Pending)
             │
             ├──► Patient receives Confirmation Email
             │    (Doctor info, requested checkup date & time, clinic instructions)
             │
             └──► Admin/Doctor receives Alert Email
                  (Patient name, phone, email, date & symptoms)
```

---

## 💻 Local Setup & Development

### 1. Clone Repository
```bash
git clone https://github.com/kaiff-ansari/Health-AppointmentApp.git
cd Health-AppointmentApp
```

### 2. Backend Setup
```bash
cd doctor-B
npm install
npm run seed:admin   # Creates default admin user
npm run dev          # Starts backend on port 5000
```

### 3. Frontend Setup
```bash
cd ../doctor-frontend
npm install
npm run dev          # Starts frontend on port 5173
```

---

## 🌐 Deployment Link

- **Live Application:** [https://health-appointment-app-liart.vercel.app](https://health-appointment-app-liart.vercel.app/)

---

## 📄 License
This project is licensed under the [ISC License](LICENSE).
