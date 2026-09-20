# ZeroHunger — Project Context for IBM Bob AI

## Project Overview
**ZeroHunger** is a full-stack MERN food-aid coordination platform aligned with **UN Sustainable Development Goal 2 (Zero Hunger)**. It connects food donors, delivery volunteers, and charitable organisations to fight food insecurity.

## Technology Stack
| Layer | Technology |
|---|---|
| Frontend | React 18 (Create React App), React Router v6, Axios |
| Backend | Node.js, Express 4, JWT (jsonwebtoken), bcryptjs |
| Database | MongoDB, Mongoose ODM |
| AI Assistant | Gemini 2.0 Flash (via `REACT_APP_GEMINI_API_KEY`) |
| Deployment | Vercel (client), Node server (server) |

## Directory Structure
```
ZeroHunger/
├── client/                        # React frontend
│   └── src/
│       ├── api.js                 # Axios instance + interceptors (auth + error handling)
│       ├── App.js                 # Root router, layout (Navbar + Footer + HelpChat)
│       ├── index.css              # Global CSS with design-token variables
│       ├── Components/
│       │   ├── Navbar.js          # Sticky top nav, role-aware links
│       │   ├── Footer.js          # Global site footer (dark, 4-column)
│       │   ├── HelpChat.js        # Floating Gemini AI chat assistant (FAB)
│       │   └── ProtectedRoute.js  # Role-based route guard
│       ├── context/
│       │   └── AuthContext.js     # JWT auth state, login/signup/logout
│       └── Pages/
│           ├── Landing Pages/     # LandingPage, LoginPage, SignUpPage
│           ├── Donor/             # DonorHomePage, DonorAcceptRequestPage, DonorMgmtPage
│           ├── Organization/      # OrganizationHomePage, FoodAidRequestPage, OrganizationMgmtPage
│           ├── Volunteer/         # VolunteerHomePage, VolunteerDeliveryAccept, VolunteerMgmt
│           └── admin/             # AdminHomePage, AdminAccept, AdminManage
└── server/                        # Express backend
    ├── server.js                  # App entry point, route mounting, DB connect
    ├── middleware/
    │   └── auth.js                # requireAuth — JWT verify + user attach
    ├── models/
    │   ├── userModel.js           # User (email, password, role enum)
    │   ├── donor/provideDonation.js   # Donation lifecycle (pending→delivered)
    │   ├── org/orgAidRequest.js   # Organisation food-aid request
    │   ├── volunteerModel.js      # Volunteer delivery record (denormalised)
    │   ├── adminModel.js          # Admin approval record
    │   └── workoutModel.js        # Legacy/utility model
    ├── routes/                    # Express routers (mirror models structure)
    └── controller/                # Business logic handlers
```

## User Roles & Protected Routes
| Role | Home Route | Key Actions |
|---|---|---|
| `donor` | `/donor-home` | Submit donations, track delivery status |
| `volunteer` | `/volunteer-home` | Accept delivery jobs, update status |
| `organization` | `/organization-home` | Post food-aid requests |
| `admin` | `/admin-home` | Approve users and oversee platform |

## Key Architecture Decisions
1. **Single User model** with a `role` enum — one login endpoint serves all four roles.
2. **JWT in localStorage** — injected globally via Axios interceptor in `api.js`.
3. **`requireAuth` middleware** on every non-public Express route.
4. **`ProtectedRoute` component** with `allowedRoles` array enforces role-based access on the client.
5. **`ProvideDonation` status lifecycle**: `pending → accepted → in-transit → delivered`.
6. **`Volunteer` model is denormalised** — stores a full copy of donor + org fields for a completed delivery job.
7. **HelpChat** uses Gemini 2.0 Flash with a platform-specific system prompt and multi-turn conversation history.

## IBM Bob AI Usage in This Project
Bob was used for:
- Architecture diagram generation and documentation
- Adding a global `Footer` component to every page
- Building the floating `HelpChat` Gemini AI assistant component
- Code review and improvement suggestions
- CSS design system consistency enforcement
