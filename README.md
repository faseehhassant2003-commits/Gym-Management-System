# 🏋️ Gym Management System

> A modern full-stack web application for managing gym members, trainers, subscriptions, payments, attendance, workout plans, and diet plans — with secure authentication, QR-based attendance, Razorpay payments, email OTP verification, and AI-powered diet recommendations.







\

---

## 🌐 Live Demo

### 🚀 Application

**[Open Gym Management System](https://gym-management-system-rn77.onrender.com)**

The application is deployed with:

* **Frontend:** Render
* **Backend:** Render
* **Database:** Railway MySQL

> The live application may require valid authentication credentials to access protected features.

---

# 📌 Overview

The **Gym Management System** is a full-stack web application designed to replace traditional manual gym management processes with a centralized digital platform.

The system provides separate experiences for **Administrators and Members**.

Administrators can manage members, trainers, subscriptions, payments, attendance, workout plans, and diet plans.

Members can register, verify their email using OTP, manage their profile, purchase subscriptions through Razorpay, scan QR codes for attendance, view payment history, and access personalized workout and diet plans.

The system also integrates **Google Gemini AI** to assist with diet plan generation and **SendGrid** for email-based services.

---

# ✨ Key Features

| Module            | Features                                                   |
| ----------------- | ---------------------------------------------------------- |
| 🔐 Authentication | Registration, Login, Email OTP, JWT, Role-based Access     |
| 👨‍💼 Admin       | Dashboard, Users, Members, Trainers, Plans, Payments       |
| 👤 Member         | Profile, Subscription, Payments, Attendance, Workout, Diet |
| 📱 QR Attendance  | QR code scanning and attendance recording                  |
| 💳 Payments       | Razorpay checkout, payment verification, payment history   |
| 📦 Subscriptions  | Plans, subscriptions, activation, status tracking          |
| 🏋️ Workout       | Workout plan creation and member assignment                |
| 🥗 Diet           | Diet plan management and AI-assisted recommendations       |
| 🤖 AI             | Google Gemini-powered diet recommendations                 |
| 📧 Email          | OTP verification and SendGrid integration                  |
| 📊 Dashboard      | Statistics, recent members, payments and analytics         |
| 🐳 DevOps         | Docker, Docker Compose, Render and Railway                 |

---

# 🔐 Authentication & Authorization

Security is implemented using **Spring Security and JWT authentication**.

### Authentication Flow

```text
┌──────────────┐
│    User      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Registration │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Email OTP    │
│ Verification │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Login     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ JWT Token    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Protected    │
│ API Requests │
└──────────────┘
```

### Security Features

* JWT authentication
* Spring Security
* Password encryption
* Role-based authorization
* Protected API endpoints
* Protected frontend routes
* Admin/member access separation
* Environment-based secret management

---

# 👨‍💼 Admin Portal

The administrator has complete control over the gym management system.

### Dashboard

The dashboard provides:

* Total members
* Member statistics
* Recent members
* Recent payments
* Attendance information
* Subscription information
* Charts and analytics

### User Management

* View users
* Manage users
* Manage roles
* Control access

### Member Management

* Add members
* View members
* Update member information
* View member statistics
* Manage member profiles

### Trainer Management

* Add trainers
* View trainers
* Update trainer information
* Manage trainer details

### Subscription Management

* Create subscription plans
* Update subscription plans
* View plans
* Manage member subscriptions
* View subscribed members
* Track subscription status

### Attendance Management

* View attendance
* Record attendance
* QR-based attendance
* Track member attendance

### Payment Management

* View payment records
* Verify payments
* Track subscription payments
* View payment history

### Workout & Diet Management

* Create workout plans
* Assign workout plans
* Create diet plans
* Assign diet plans
* Manage member-specific plans

---

# 👤 Member Portal

Members have access to their personal gym information.

### Member Features

* Secure login
* Profile management
* View subscription
* Purchase subscription
* Razorpay payment
* View payment history
* QR attendance
* View attendance history
* View workout plans
* View diet plans
* AI-assisted diet recommendations

---

# 📱 QR Code Attendance

The application provides QR-based attendance tracking.

### Attendance Flow

```text
Member
   │
   ▼
Open QR Scanner
   │
   ▼
Scan Gym QR Code
   │
   ▼
Validate Request
   │
   ▼
Record Attendance
   │
   ▼
MySQL Database
   │
   ▼
Attendance History
```

This reduces manual attendance entry and provides a faster check-in process.

---

# 💳 Razorpay Payment Integration

The system integrates **Razorpay** for online subscription payments.

### Payment Flow

```text
Member
   │
   ▼
Select Subscription
   │
   ▼
Create Razorpay Order
   │
   ▼
Razorpay Checkout
   │
   ▼
Complete Payment
   │
   ▼
Verify Payment
   │
   ▼
Save Payment
   │
   ▼
Activate Subscription
```

### Payment Features

* Razorpay Checkout
* Payment order creation
* Online subscription payment
* Payment verification
* Payment records
* Payment history
* Subscription activation

> Razorpay credentials are stored securely as environment variables.

---

# 📧 Email OTP Verification

Email verification is implemented using OTP-based registration.

### OTP Flow

```text
Registration
     │
     ▼
Generate OTP
     │
     ▼
Send OTP via Email
     │
     ▼
User Enters OTP
     │
     ▼
Verify OTP
     │
     ▼
Create Account
```

### Email Technology

**SendGrid** is used for email delivery.

---

# 🤖 AI-Powered Diet Recommendations

The system integrates **Google Gemini AI** to assist in generating diet recommendations.

### AI Flow

```text
Member Information
       │
       ▼
Diet Requirements
       │
       ▼
Google Gemini API
       │
       ▼
AI Generated Recommendation
       │
       ▼
Diet Plan
```

The AI feature is designed to provide personalized recommendations based on available member information.

---

# 🏋️ Workout Management

Administrators can create and manage workout plans for members.

### Features

* Create workout plans
* Update workout plans
* Assign plans to members
* View assigned plans
* Member-specific workout information

---

# 🥗 Diet Management

The system provides both manually managed and AI-assisted diet functionality.

### Features

* Create diet plans
* Update diet plans
* Assign diet plans
* View member diet plans
* AI-assisted recommendations

---

# 📦 Subscription Management

Subscription plans are centrally managed by administrators.

### Subscription Flow

```text
Admin Creates Plan
       │
       ▼
Member Views Plans
       │
       ▼
Member Selects Plan
       │
       ▼
Razorpay Payment
       │
       ▼
Payment Verification
       │
       ▼
Subscription Activated
```

---

# 🏗️ System Architecture

```text
                         ┌──────────────────┐
                         │      Users       │
                         │ Admin / Member   │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ React + Vite     │
                         │    Frontend      │
                         └────────┬─────────┘
                                  │
                              REST APIs
                                  │
                              JWT Token
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  Spring Boot     │
                         │     Backend      │
                         ├──────────────────┤
                         │ Controllers      │
                         │ Services         │
                         │ Repositories     │
                         │ Spring Security  │
                         │ JWT              │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │     MySQL 8      │
                         │     Database     │
                         └──────────────────┘

              ┌────────────────────────────────────┐
              │          External Services         │
              ├────────────────────────────────────┤
              │ Razorpay   → Online Payments       │
              │ Gemini     → AI Diet Generation    │
              │ SendGrid   → Email / OTP           │
              └────────────────────────────────────┘
```

---

# 🧱 Backend Architecture

The backend follows a layered architecture:

```text
Controller
    │
    ▼
Service
    │
    ▼
Repository
    │
    ▼
Database
```

### Controller Layer

Handles HTTP requests and API endpoints.

Examples:

* Authentication
* Members
* Trainers
* Attendance
* Payments
* Subscriptions
* Workout
* Diet
* Dashboard
* Users

### Service Layer

Contains application business logic.

### Repository Layer

Uses Spring Data JPA for database operations.

### Security Layer

Handles:

* Authentication
* JWT validation
* User details
* Role authorization
* Protected endpoints

---

# 🗄️ Database Design

The application uses **MySQL 8**.

### Major Entities

```text
User
Member
Trainer
Attendance
Payment
SubscriptionPlan
MemberSubscription
WorkoutPlan
DietPlan
OtpVerification
```

### Simplified Relationship

```text
User
 │
 ├──────────────► Member
 │
 └──────────────► Trainer

Member
 │
 ├──────────────► Attendance
 ├──────────────► Payment
 ├──────────────► MemberSubscription
 ├──────────────► WorkoutPlan
 └──────────────► DietPlan

SubscriptionPlan
 │
 └──────────────► MemberSubscription
```

---

# 🛠️ Technology Stack

## Frontend

* React
* Vite
* JavaScript
* Axios
* React Router
* CSS

## Backend

* Java 21
* Spring Boot
* Spring Data JPA
* Hibernate
* Spring Security
* JWT
* REST APIs
* Maven

## Database

* MySQL 8

## Integrations

* Razorpay
* Google Gemini API
* SendGrid

## DevOps

* Git
* GitHub
* Docker
* Docker Compose
* Render
* Railway

---

# 📁 Project Structure

```text
Gym-Management-System/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/gymmanagement/
│   │   │   │   ├── config/
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   ├── entity/
│   │   │   │   ├── enums/
│   │   │   │   ├── repository/
│   │   │   │   ├── security/
│   │   │   │   └── service/
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   │
│   │   └── test/
│   │
│   ├── Dockerfile
│   ├── pom.xml
│   └── mvnw
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── styles/
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   └── vite.config.js
│
├── docker-compose.yml
├── .gitignore
├── .env.example
└── README.md
```

---

# 🔑 Environment Configuration

Sensitive credentials are **not hardcoded** in the application.

Backend configuration uses environment variables:

```properties
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}

gemini.api.key=${GEMINI_API_KEY}

sendgrid.api-key=${SENDGRID_API_KEY}
sendgrid.from=${SENDGRID_FROM}
```

Razorpay credentials should also be configured through environment variables:

```text
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

Frontend:

```text
VITE_API_URL=https://your-backend-url
```

### ⚠️ Security

Never commit:

```text
.env
.env.local
.env.production
API keys
Database passwords
JWT secrets
Razorpay secrets
Gemini API keys
SendGrid API keys
```

to a public GitHub repository.

---

# 💻 Local Development

## Prerequisites

Install:

* Java 21
* Node.js
* npm
* MySQL 8
* Git
* Docker Desktop *(optional)*

---

## 1. Clone Repository

```bash
git clone https://github.com/faseehhassant2003-commits/Gym-Management-System.git
```

```bash
cd Gym-Management-System
```

---

## 2. Configure Database

Create the MySQL database:

```sql
CREATE DATABASE gym_management;
```

Configure:

```text
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/gym_management
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
```

---

## 3. Configure External Services

### Gemini

```text
GEMINI_API_KEY=your_gemini_api_key
```

### SendGrid

```text
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM=your_verified_email
```

### Razorpay

```text
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

---

## 4. Run Backend

```bash
cd backend
```

Windows:

```bash
.\mvnw spring-boot:run
```

Backend:

```text
http://localhost:8080
```

---

## 5. Run Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🐳 Docker

The project supports Docker-based deployment.

### Start

```bash
docker compose up --build
```

### Stop

```bash
docker compose down
```

Docker configuration includes:

* Frontend container
* Backend container
* MySQL configuration
* Docker Compose orchestration

---

# 🧪 Testing

The backend includes automated tests.

Current test coverage includes important application functionality such as:

* Authentication
* Member services
* Application context

Example test classes:

```text
GymManagementSystemApplicationTests
AuthServiceTest
MemberServiceTest
```

### Manual Testing Areas

* Registration
* Email OTP
* Login
* JWT authentication
* Role authorization
* Member management
* Trainer management
* Subscription plans
* Razorpay payments
* Payment verification
* Attendance
* QR scanner
* Workout plans
* Diet plans
* Gemini AI
* Dashboard
* Profile management
* Protected routes

---

# 🚀 Deployment

The application is deployed using cloud services.

```text
                     GitHub
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
          Render                Railway
             │                     │
       ┌─────┴─────┐               │
       │           │               │
       ▼           ▼               ▼
   Frontend     Backend          MySQL
    React      Spring Boot      Database
```

### Production Stack

| Component   | Platform      |
| ----------- | ------------- |
| Frontend    | Render        |
| Backend     | Render        |
| Database    | Railway MySQL |
| Source Code | GitHub        |

---

# 🔄 Core Application Flows

## User Registration

```text
Registration
     ↓
Generate OTP
     ↓
Send Email
     ↓
Verify OTP
     ↓
Create Account
     ↓
Login
```

## Authentication

```text
Login
  ↓
Spring Security
  ↓
JWT Generation
  ↓
JWT Sent to Frontend
  ↓
Protected Requests
  ↓
JWT Validation
  ↓
Role Authorization
```

## Subscription

```text
Select Plan
    ↓
Create Razorpay Order
    ↓
Payment
    ↓
Verify Payment
    ↓
Store Payment
    ↓
Activate Subscription
```

## Attendance

```text
QR Scanner
    ↓
Scan
    ↓
Validate
    ↓
Record Attendance
    ↓
Database
```

## AI Diet

```text
Member Data
    ↓
Diet Requirements
    ↓
Gemini API
    ↓
AI Recommendation
    ↓
Diet Plan
```

---

# 📸 Screenshots

Screenshots can be added here to showcase the application.

### Login

*Add login page screenshot here.*

### Admin Dashboard

*Add dashboard screenshot here.*

### Member Dashboard

*Add member dashboard screenshot here.*

### Subscription & Razorpay

*Add subscription/payment screenshot here.*

### QR Scanner

*Add QR scanner screenshot here.*

### Workout Plans

*Add workout page screenshot here.*

### Diet Plans

*Add diet page screenshot here.*

---

# 📈 Future Enhancements

Potential future improvements:

* 📱 Dedicated Android/iOS application
* 🔔 Push notifications
* 📅 Automated subscription expiry reminders
* 💳 Automatic subscription renewal
* 📊 Advanced analytics
* 🏃 Workout progress tracking
* 🤖 Advanced AI fitness recommendations
* 👨‍🏫 Trainer-specific dashboard
* 📧 Automated payment reminders
* ☁️ Cloud image/file storage
* 📑 Advanced reports
* 📈 Financial analytics

---

# 🎯 Project Objectives

The project aims to:

1. Digitize gym management operations.
2. Reduce manual record keeping.
3. Improve member management.
4. Simplify trainer management.
5. Provide secure authentication.
6. Manage subscriptions digitally.
7. Enable online payments through Razorpay.
8. Track attendance through QR scanning.
9. Manage workout and diet plans.
10. Provide AI-assisted diet recommendations.
11. Maintain centralized payment records.
12. Provide useful administrative analytics.
13. Provide members with easy access to their gym information.
14. Deploy a complete production-ready full-stack application.

---

# 🌟 Why This Project?

This project demonstrates practical experience with:

* Full-stack development
* REST API development
* Frontend/backend integration
* Database design
* Authentication and authorization
* JWT security
* Payment gateway integration
* Email services
* QR code processing
* AI API integration
* Docker
* Cloud deployment
* Git/GitHub
* Production environment configuration

---

# 👨‍💻 Developer

## Faseeh Hassan

**Full-Stack Developer | Computer Science Engineering**

### Built With

```text
React
Vite
Java 21
Spring Boot
Spring Security
JWT
MySQL
Hibernate
Razorpay
Google Gemini
SendGrid
Docker
Git
GitHub
Render
Railway
```

---

# 📄 License

This project was developed for **academic, educational, and portfolio purposes**.

---
