# SecureBank — Smart Queue Management System

A full-stack MERN application that replaces the physical queue with a live, digital one. Customers join a queue from their phone, watch their position update in real time, and get notified the moment it's their turn — while staff run the whole thing from a single dashboard. Built as part of a technical assessment for a MERN Stack internship.

No polling, no manual refreshing — every state change (a customer joining, staff calling the next token, a no-show) is pushed instantly to every connected screen over Socket.io.

---

## Features

### Customer
- Select a service category before joining the queue
- Join with just a name and phone number — no account required
- Instant token generation (e.g. `A-014`)
- Live position tracking with an animated queue visual
- Estimated wait time based on position and service duration
- Automatic redirect to a "your turn" screen the moment staff calls them

### Staff
- Secure, token-based login
- Dashboard scoped to their assigned counter and service category
- Call the next customer in line
- Mark a customer as served or as a no-show
- View a running history of everyone served that day

### System
- Category-wise, independently tracked queues
- Daily token numbering per category (resets each day)
- Automatic wait-time estimation from live queue depth
- Real-time synchronization across all connected clients via Socket.io rooms scoped per category

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Real-time | Socket.io |
| Auth | JWT |

---

## Project Architecture

```
┌───────────────────┐        HTTP (REST)        ┌───────────────────┐
│                   │ ─────────────────────────▶ │                   │
│   React Frontend  │                            │  Express Backend  │
│  (Customer +      │ ◀───────────────────────── │                   │
│   Staff views)    │        Socket.io            │                   │
│                   │ ◀═════════════════════════▶│                   │
└───────────────────┘      (live queue events)    └─────────┬─────────┘
                                                              │
                                                              │ Mongoose
                                                              ▼
                                                    ┌───────────────────┐
                                                    │     MongoDB        │
                                                    │  (queue, staff,    │
                                                    │  categories, etc.) │
                                                    └───────────────────┘
```

Every mutation to a queue (join, call-next, serve, no-show) is written to MongoDB first, then broadcast over Socket.io to a room scoped to that service category — so a customer only receives updates relevant to the queue they're actually in.

---

## Folder Structure

```
securebank/
├── backend/
│   ├── config/         # MongoDB connection
│   ├── models/          # ServiceCategory, Counter, QueueEntry, Staff
│   ├── routes/          # queue, category, counter, staff endpoints
│   ├── socket/          # Socket.io room + broadcast logic
│   ├── utils/           # token generation, wait-time calculation
│   ├── seed.js          # sample data + demo staff logins
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/          # REST client + socket connection
    │   ├── components/   # QueueAvatarRow, ServiceCard, etc.
    │   ├── layouts/       # SplitScreenLayout (customer), DashboardLayout (staff)
    │   └── pages/
    │       ├── customer/  # Home → SelectService → Details → Confirmed → Live → YourTurn
    │       └── staff/     # Login → Dashboard → History
    └── vite.config.js
```

---

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env      # add your MongoDB URI and a JWT secret
npm run seed               # creates categories, counters, and demo staff logins
npm run dev                 # runs on http://localhost:5000
```

---

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev                 # runs on http://localhost:5173
```

---

## Demo Credentials

| Staff ID | Counter | Service |
|---|---|---|
| `STF-101` | Counter 1 | Account Opening |
| `STF-102` | Counter 2 | Deposit / Withdrawal |
| `STF-103` | Counter 3 | Loan Enquiry |
| `STF-104` | Counter 4 | Cheque Book Request |

Password for all demo accounts: `password123`

---

## Usage Instructions

1. Start the backend and frontend as described above.
2. Open `http://localhost:5173` in one browser window — this is the customer view.
3. Open `http://localhost:5173/staff/login` in a second window and log in with one of the demo credentials above.
4. Join the queue as a customer, selecting the same service the logged-in staff member's counter handles.
5. From the staff dashboard, click **Call**, then **Serve** — watch the customer's screen update instantly with no refresh.

---

## Assumptions

- Single branch, single active counter per service category.
- Customer flow is guest-based — no account creation or OTP verification.
- Token numbers are scoped per category and reset daily.
- Estimated wait time = (position in queue) × (category's average service time).

---

## Engineering / Design Decisions

- **Socket.io rooms scoped per category** — a customer only receives updates for the queue they've actually joined, not a global broadcast to every connected client.
- **Framer Motion's `layout` animation** drives the queue visual — when someone is served and drops out of the list, the remaining avatars reflow automatically without any manual animation logic.
- **Split-screen layout for customers** — a branding panel plus a focused content panel, since the customer flow is typically used once, briefly, on a phone.
- **Sidebar dashboard layout for staff** — since staff use this repeatedly, at a fixed desk, for an entire shift, it follows the same structural pattern as any internal admin tool.
- **Passwords are hashed with bcrypt** before being persisted, never stored or compared in plain text.

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/categories` | List active service categories |
| `POST` | `/api/queue/join` | Customer joins a queue, returns a token |
| `GET` | `/api/queue/status/:tokenId` | Get a specific token's live position |
| `GET` | `/api/queue/category/:categoryId` | Full live queue for a category |
| `POST` | `/api/queue/call-next` | Call the next waiting customer |
| `POST` | `/api/queue/:id/serve` | Mark a token as served |
| `POST` | `/api/queue/:id/no-show` | Mark a token as a no-show |
| `GET` | `/api/queue/category/:categoryId/history` | Today's served/no-show history |
| `POST` | `/api/staff/login` | Staff authentication, returns a JWT |
| `GET` | `/api/counters/my-counter/:staffId` | Counter assigned to a logged-in staff member |

---

## Future Scope

- An admin panel for managing counters, categories, and staff assignments across branches.
- SMS or email notifications as an alternative to in-app real-time updates.
- Support for multiple active counters per service category, with load balancing between them.
- Multi-branch support.

---

## Screenshots

<img width="1917" height="862" alt="Customer front page" src="https://github.com/user-attachments/assets/f73212dc-aace-4cfc-9a5d-ddbc0059d283" />

<img width="1918" height="867" alt="Select a service" src="https://github.com/user-attachments/assets/811729d5-389f-466b-b2c8-849ba788d857" />

<img width="1917" height="867" alt="Fill the details" src="https://github.com/user-attachments/assets/f5914b85-3d47-4d50-93f8-27d5e9e215d2" />

<img width="1918" height="866" alt="Token generation" src="https://github.com/user-attachments/assets/4869c2f2-4ab4-419d-8310-0dd14bbbef84" />

<img width="1917" height="870" alt="Live waiting" src="https://github.com/user-attachments/assets/c45f5784-6dba-48c2-a7b8-55c4b74a732f" />

<img width="1917" height="867" alt="Customer Notification page" src="https://github.com/user-attachments/assets/a7494f3c-a4db-479a-9acf-6e5f0d4edcfa" />


<img width="1917" height="868" alt="Staff login" src="https://github.com/user-attachments/assets/cc3740b8-6d30-4afe-ac8c-394065f67275" />

<img width="1918" height="865" alt="Staff counter Page" src="https://github.com/user-attachments/assets/442ad6fd-12dc-42f6-b477-6cd89dd1ec5a" />

---

## Conclusion

SecureBank was built to solve a problem most people run into in person — waiting in a line with no idea how long it'll take — using a stack and set of real-time patterns (Socket.io rooms, live-reflowing UI, JWT-secured staff access) that scale beyond a single bank branch to any queue-based service: clinics, salons, or government offices. The scope here was kept deliberately tight to ship a clean, fully working MVP rather than a wider but shallower feature set.
