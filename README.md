*This project has been created as part of the 42 curriculum by <meel-war>, <pribolzi>, <mbenzira>, <mubersan>.*

# 42dle - ft_transcendence

## Description

42dle is a web application created for the 42 `ft_transcendence` project. The project combines the required real-time multiplayer experience with a LoLdle-inspired game direction.

The goal is to provide a complete browser-based application where users can register, authenticate, manage their profile, add friends, chat in real time, invite friends to ranked games, play multiplayer guessing matches, track their progress, and use additional game modes.

Key features:

- User registration and authentication.
- JWT-based session management with HTTP-only cookies.
- 42 OAuth authentication.
- Two-factor authentication.
- User profile and settings management.
- Friend requests, friends list, online status, and blocking.
- Persistent private chat.
- Real-time chat events with Socket.IO.
- Advanced chat features: game invites from chat, typing indicator, read receipts, user profile access, and basic content moderation.
- Multiplayer ranked game mode.
- Remote players support.
- Match history, ranking data, Elo/ranked wins, and gamification.
- Secured public API for LolDle champion data.
- Multiple languages.
- Custom frontend design system.
- PostgreSQL database managed through Prisma ORM.
- Docker-based deployment with a reverse proxy.

## Team Information

| Team member | 42 login | Assigned role(s) | Main responsibilities |
| Mehdi | `<meel-war>` | Product Owner, Technical Lead, Developer, backend/frontend integration, auth/social/chat contributor | Authentication flow, users/profile integration, friends system, global chat integration, social socket integration, real-time chat features, game invitations through social socket, read receipts, typing indicator, project understanding/documentation support. |
| Paul | `<pribolzi>` | Product Owner, Project Manager, Developer, gameplay/multiplayer contributor | Multiplayer game logic, matchmaking, game socket, remote players (zrok tunnel), content moderation AI, Infinite mode, Daily Loldle game mode. |
| Amine | `<mbenzira>` | Developer, frontend/design contributor | Visual interface, custom design system (`shadcn`/Tailwind), responsive layouts, avatar management (`AvatarPicker`), browser compatibility, 2FA frontend UI/integration (`requires2FA` login modal & settings), UI polish. |
| Murad | `<mubersan>` | Developer, gamification/auth contributor | Gamification, leaderboard/statistics, match history, remote authentication with 42, multiple languages, secured public API. |

## Project Management

Work organization:

- The team split the project into feature areas: authentication/users, gameplay/multiplayer, database/game data, frontend UI/design, gamification, social/chat.
- Work was done on separate Git branches, then merged into the integration branches after testing.
- The team coordinated feature ownership to avoid conflicts between gameplay, frontend design, backend APIs, and database schema changes.
- Important integration points were tested manually with Docker, browser tests, and backend `curl` requests.

Tools used:

- Git and GitHub for version control.
- Git branches for feature development.

Communication:

- in-person meeting.
- private message between team members

## Technical Stack

### Frontend

- React 19.
- TypeScript.
- Vite.
- React Router.
- Socket.IO client.
- Tailwind CSS / utility-based styling.
- shadcn/radix-ui inspired UI components.
- lucide-react icons.
- sonner notifications.

Why:

- React and TypeScript provide a structured component-based frontend with type safety.
- Vite gives fast development builds.
- Socket.IO client is used for real-time social and game communication.
- A custom design system keeps the interface consistent across pages.

### Backend

- NestJS.
- TypeScript.
- Socket.IO through `@nestjs/websockets` and `@nestjs/platform-socket.io`.
- Prisma ORM.
- PostgreSQL.
- JWT authentication through `@nestjs/jwt`.
- Cookie-based auth with `cookie-parser`.
- class-validator / class-transformer for DTO validation.
- TensorFlow toxicity model for content moderation.
- otplib / qrcode for 2FA.

Why:

- NestJS provides a clear structure with modules, controllers, services, guards, and gateways.
- Prisma provides typed database access and migrations.
- PostgreSQL is reliable for relational data such as users, friendships, messages, matches, guesses, and rewards.
- Socket.IO is used because the project requires real-time interactions.
- HTTP-only cookies are used for JWT storage to reduce exposure to frontend JavaScript.

### Infrastructure

- Docker and Docker Compose.
- Nginx reverse proxy.
- PostgreSQL container.

Why:

- Docker makes the project easier to run consistently across machines.
- Nginx provides a single gateway for frontend/backend/socket routing.

## Instructions

### Prerequisites

Required software:

- Docker and Docker Compose.
- Node.js and npm, if running services manually outside Docker.
- Git.

Recommended versions:

- Node.js: use a recent LTS version if running outside Docker.
- Docker Compose v2 (`docker compose`, not necessarily legacy `docker-compose`).

### Environment setup

Create `backend/.env` from `backend/env.example`.

Example:

```env
DATABASE_URL="prisma+postgres://localhost:676767/?api_key=42dle"
POSTGRES_USER=admin_user
POSTGRES_PASSWORD=password
POSTGRES_DB=my_db
JWT_SECRET=change_this_secret
FRONTEND_URL=https://localhost:5173
FORTYTWO_CLIENT_ID=<your_42_client_id>
FORTYTWO_CLIENT_SECRET=<your_42_client_secret>
FORTYTWO_CALLBACK_URL=https://localhost:3000/api/auth/42/callback
```

Notes:

- `JWT_SECRET` must be changed for any real deployment.
- 42 OAuth requires valid credentials from the 42 API.
- The exact URLs may differ depending on whether the app is accessed through Vite directly or the Nginx gateway.

### Run with Docker

From the repository root:

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000/api`
- Gateway: `http://localhost:8080` and HTTPS gateway on `8443` if configured.
- PostgreSQL: `localhost:5432`

### Prisma setup

When the backend container starts, migrations and seed may be run depending on the Dockerfile/start script.

If running locally or debugging Prisma manually:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
```

To inspect the database:

```bash
cd backend
npx prisma studio
```

### Manual local development

Backend:

```bash
cd backend
npm install
npm run start:dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Build checks:

```bash
cd backend
npm run build
```

```bash
cd frontend
npm run build
```

### Useful test endpoints

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/champions/names
```

Login/register examples depend on the current database state and should be tested through the frontend or with `curl` using JSON payloads.

## Usage Overview

1. Create an account or log in with 42 OAuth.
2. Complete optional security/profile settings.
3. Add another user as a friend.
4. Accept the friend request from the other account.
5. Open the global chat.
6. Send private messages in real time.
7. Invite a friend to a ranked game from chat or the ranked lobby.
8. Play the multiplayer guessing match.
9. Check profile, leaderboard, match history, and gamification progress.

## Database Schema

The project uses PostgreSQL with Prisma models. The main relations are:

```txt
User
  ├── sent_friendships      -> Friendship.requester
  ├── received_friendships  -> Friendship.addressee
  ├── sent_messages         -> Message.sender
  ├── received_messages     -> Message.receiver
  ├── matches_participated  -> Match_Participant
  └── rewards               -> Daily_Reward

Friendship
  ├── requester_id -> User.id
  ├── addressee_id -> User.id
  └── status: pending | accepted | blocked

Message
  ├── sender_id   -> User.id
  ├── receiver_id -> User.id
  ├── content
  ├── created_at
  └── read_at

Match
  ├── target_champion_id -> Champion.id
  ├── participants       -> Match_Participant[]
  └── guesses            -> Guess[]

Match_Participant
  ├── match_id -> Match.id
  ├── user_id  -> User.id
  └── guesses  -> Guess[]

Guess
  ├── match_id       -> Match.id
  ├── champion_id    -> Champion.id
  ├── participant_id -> Match_Participant.id
  └── comparison_result: Json

Champion
  ├── name
  ├── gender
  ├── position
  ├── species
  ├── resource_type
  ├── range_type
  ├── region
  └── release_year

Country / DailyCountryMatch
  └── Countrydle-related daily country data
```

Important models:

- `User`: account, auth, profile, online status, Elo, ranked stats, 2FA/OAuth fields.
- `Friendship`: friend request, accepted friendship, and block state.
- `Message`: private messages with persistent read receipts.
- `Match`: multiplayer game sessions.
- `Match_Participant`: users participating in a match.
- `Guess`: each player attempt and comparison result.
- `Champion`: LoLdle-style champion metadata.
- `Daily_Reward`: gamification data.
- `Country` and `DailyCountryMatch`: country game mode data.

## Features List

### Authentication and users

Implemented by: Mehdi, Murad, Amine.

- Local registration and login. (Mehdi)
- Password hashing with salt and `scrypt`. (Mehdi)
- JWT session management. (Mehdi)
- HTTP-only cookie authentication. (Mehdi)
- `/auth/me` session recovery. (Mehdi)
- Logout. (Mehdi)
- 42 OAuth login. (Murad)
- 2FA frontend UI/modal setup and two-step verification login flow (`requires2FA` integration with Google Authenticator TOTP). (Amine)
- Profile display and profile editing. (Mehdi)
- Password update. (Mehdi)
- Public user data separation from sensitive database fields. (Mehdi)

Mehdi contribution details:

- Worked on the backend/frontend auth and users integration.
- Implemented or integrated local register/login flow.
- Ensured backend responses do not expose `password_hash`.
- Worked with `PublicUser`/`AuthUser` style response shaping.
- Added and reviewed JWT guard behavior.
- Helped move the frontend from simulated auth to `AuthContext`.
- Connected protected routes and guest routes.
- Worked on settings/profile integration with backend routes.

Amine contribution details:

- Built the two-factor authentication (2FA) frontend interfaces (`settingsPage.tsx` and `two-factor.api.ts`).
- Created the QR Code generation modal (`/2fa/generate`) and initial 6-digit verification activation (`/2fa/turn-on`).
- Integrated the two-step login verification flow (`LoginPage.tsx`), handling the `requires2FA: true` response to display the Google Authenticator TOTP input and finalize authentication via `/2fa/authenticate`.
- Use modern notification UI (toaster)

Murad contribution details:

- Implemented the backend 42 OAuth authorization and callback flow in `AuthController` and `AuthService`.
- Exchanged the authorization code for a 42 access token and used it to retrieve the authenticated user's 42 profile.
- Added OAuth user lookup and creation using the 42 identifier, username, email, and profile image.
- Prevented duplicate accounts when a local account already uses the email returned by 42.
- Connected the frontend 42 login redirect and callback page to authentication state recovery.


### Friends and user interaction

Implemented by: Mehdi, Amine.

- Send friend requests. (Mehdi)
- Receive friend requests. (Mehdi)
- Accept requests. (Mehdi)
- Delete friends. (Mehdi)
- Block users. (Mehdi)
- Online/offline status display. (Mehdi)
- Realtime friend list refresh with `friends_changed`. (Mehdi)
- Custom UI Design System and visual styling. (Amine)
- Responsive multi-device layout (`Layout.tsx`, grid adaptations). (Amine)
- Avatar management (`AvatarPicker`, default gallery, web link, file upload, and initial fallback). (Amine)
- 2FA settings modal and status section. (Amine)

Mehdi contribution details:

- Implemented/reviewed the backend friend request flow.
- Worked on `FriendsService` logic:
  - self-request prevention;
  - target user existence check;
  - duplicate friendship check in both requester/addressee directions;
  - accept/delete authorization checks;
  - accepted friends lookup;
  - block behavior.
- Connected the frontend friend list to backend APIs.
- Integrated realtime refresh with the social socket.

Amine contribution details:

- Designed and developed the user interaction visual components across profile, settings, and friend pages using custom Tailwind CSS / `shadcn` components.
- Developed the full `AvatarPicker` component and `Avatar` Radix UI integration, allowing users to choose between 6 local default gaming avatars, a direct web link, or local image upload via `FileReader` base64 conversion, along with stylized initial fallbacks.
- Ensured full mobile and desktop responsiveness (`grid-cols-3 sm:grid-cols-4 md:grid-cols-5...`) across all user interaction views.


### Private chat and advanced chat

Implemented by: Mehdi, Paul.

- Persistent private messages. (Mehdi)
- Conversation history. (Mehdi)
- Realtime message delivery. (Mehi)
- Message error handling. (Mehdi)
- Typing indicators. (Mehi)
- Read receipts with `read_at`. (Mehdi)
- User blocking affects messaging. (Mehdi)
- Invite users to play directly from chat. (Mehdi)
- Access user profiles from chat. (Mehdi)
- Content moderation AI. (Paul)

Paul contribution details:

- Integrated automatic content moderation into `ChatService` using a TensorFlow toxicity model.
- Handled loading of the toxicity model on module initialization with specific toxicity categories (`toxicity`, `insult`, `threat`) and a confidence threshold of 0.85.
- Intercepted and blocked messages flagged as toxic, throwing a bad request exception to the sender to prevent offensive chat.

Mehdi contribution details:

- Built and integrated private chat around `ChatService`, `ChatController`, `chat.api.ts`, and `GlobalChat`.
- Added persistent conversation loading through REST.
- Integrated realtime sending/receiving over the social socket.
- Implemented read receipt flow:
  - frontend emits `mark_message_read`;
  - backend updates `Message.read_at`;
  - backend emits `message_read`;
  - frontend displays `Lu` only on sent messages.
- Implemented typing indicator flow:
  - frontend emits `typing_start` / `typing_stop`;
  - backend relays `typing_started` / `typing_stopped`;
  - frontend displays typing state only for the selected friend.
- Connected chat game invitations through `SocialSocketContext`.
- Added block handling from the chat UI.
- Added profile access from chat.

### Realtime features

Implemented by: Paul, Mehdi.

- `/social` Socket.IO namespace for social features. (Mehdi)
- `/game` Socket.IO namespace for game features. (Paul)
- Authenticated sockets using JWT cookies. (Mehdi)
- Per-user rooms with `user:<id>`.
- Online/offline presence. (Mehdi)
- Realtime private chat. (Mehdi)
- Realtime game invitations. (Mehdi)
- Realtime multiplayer game room. (Paul)

Mehdi contribution details:

- Worked on the social socket flow:
  - `SocialSocketContext`;
  - `SocialGateway`;
  - socket auth through cookies;
  - `client.data.userId`;
  - `user:<id>` rooms;
  - friends refresh events;
  - chat message events;
  - typing/read receipt events;
  - game invitation events.
- Helped separate social socket responsibilities from game socket responsibilities.
- Worked on logout/offline behavior and refresh-safe online status.

Paul contribution details:

- Implemented the `/game` Socket.IO gateway (`GameGateway`) handling matchmaking, live game state updates, turn validation, and multiplayer synchronization.
- Created real-time multiplayer game rooms using socket communication.
- Managed user connection and disconnection states specific to the gaming flow to prevent data corruption.

### Multiplayer game

Implemented by: Paul.

- Ranked matchmaking.
- Remote players.
- Game rooms.
- Turn-based guessing.
- Match creation and match end.
- Reconnection/forfeit handling.
- Match history data.

Paul contribution details:

- Developed ranked matchmaking and game room flow, pairing active users automatically.
- Designed turn-based guessing mechanics and verification logic on the backend to prevent cheating.
- Managed match state progression (creation, guess submission, victory delay screens, and resolution).
- Secured the game by removing insecure REST APIs (e.g. `getExactChampByID`) and blocking client-side leaks of champion identities.
- Handled reconnection logic and player forfeit/abandon states gracefully.

### Gamification and statistics

Implemented by: Murad.

- Elo/ranking data.
- Ranked wins/losses.
- Leaderboard.
- Daily rewards / XP / level data.
- Match history.

Murad contribution details:

- Created `GamificationModule`, `GamificationController`, and `GamificationService`, with frontend access through `gamification.api.ts`.
- Implemented daily XP rewards based on the number of attempts, with one reward allowed per day.
- Added current streak, best streak, streak reset, streak bonus, XP totals, and automatic level calculation.
- Integrated daily-game rewards into the champion game service and displayed progress and badges on user profiles.
- Implemented ranked Elo changes for wins, losses, and draws, including ranked win/loss counter updates.
- Used a Prisma transaction to update both ranked players consistently after a completed match.
- Added the top-10 leaderboard endpoint ordered by Elo and connected it to `LeaderboardPage`.
- Connected authenticated match-history data to `MatchHistoryPage`, including opponent, result, Elo variation, avatar, and localized date.

### Public API

Implemented by: Murad.

- Secured public API for LolDle champion data.
- API-key authentication separated from JWT authentication.
- Read and write API keys with explicit write permission for `POST`, `PUT`, and `DELETE`.
- Rate limiting for public API requests.
- Public API documentation with `curl` examples.

Murad contribution details:

- Created an independent `PublicApiModule` with its own controller, service, guards, DTOs, and documentation.
- Implemented public champion endpoints:
  - `GET /api/public/champions`;
  - `GET /api/public/champions/:id`;
  - `POST /api/public/champions`;
  - `PUT /api/public/champions/:id`;
  - `DELETE /api/public/champions/:id`.
- Added `PublicApiKeyGuard` to keep API-key authentication separate from `JwtAuthGuard`.
- Added explicit read/write permission handling so a read key cannot create, update, or delete data.
- Added a public API rate-limit guard using `PUBLIC_API_RATE_LIMIT`.
- Limited returned fields to public champion gameplay data and avoided exposing user, auth, chat, friend, OAuth, or 2FA data.
- Documented the API in `docs/public-api.md` with security notes and request examples.

### Game modes and data

Implemented by: Paul (Daily & Infinite Loldle modes, Multiplayer), Murad (Countrydle mode).

- Classic champion guessing mode (Daily Loldle). (Paul)
- Infinite champion guessing mode. (Paul)
- Ranked multiplayer mode. (Paul)
- Countrydle mode. (Murad)
- Champion and country seed data. (Paul, Murad)

Paul contribution details:

- Implemented the Daily Loldle (classic guessing) mode, utilizing local storage to persist the player's progression across the day and prevent cheating.
- Designed and built the Infinite champion guessing mode backend APIs and frontend integration.
- Worked on the comparison engine that returns comparative results (position, region, species, etc.) for each champion guess.
- Set up seeds for champions data in the PostgreSQL database.

Murad contribution details:

- Implemented the Countrydle frontend flow with country loading, autocomplete suggestions, input validation, and duplicate-guess prevention.
- Added daily country guesses and comparison feedback for flag, continent, language, population, and currency.
- Integrated the reusable game form, history grid, and victory state into `CountrydlePage`.
- Added the country API types and frontend API calls for country names and daily guesses.
- Implemented the backend country and daily-country-match services used by the game mode.
- Added the Prisma country models, database migration, country seed integration, and country dataset.

### Frontend UI and design

Implemented by: Amine, with integration work by the rest of the team.

- Custom UI design system inspired by `shadcn` / Radix UI with Tailwind CSS. (Amine)
- Responsive layouts and multi-device grid adaptations (`Layout.tsx`). (Amine)
- Global navigation bar with user profile dropdown menu and universe theme toggle (`toggleUniverse`). (Amine)
- Global real-time chat component (`GlobalChat`) visual structure and notification toast system (`Sonner`). (Amine)
- Game pages styling (`ClassicGamePage`, `InfiniteGamePage`, `RankedGamePage`, `CountrydlePage`, `RankedLobbyPage`). (Amine)
- Profile, settings, and friends UI structure, dialogs, and modals. (Amine)
- Multilingual text layout integration. (Amine)
- Browser compatibility testing and adjustments across major browsers (Chrome, Firefox, ). (Amine)

Amine contribution details:

- Built the visual foundation of the web application (`index.css`, custom tokens, glassmorphism, dynamic animations, and `DynamicBackground`).
- Designed reusable UI primitives (`Button`, `Input`, `Dialog`, `Avatar`, `Heading`, `PageContainer`) ensuring uniform styling across all pages.
- Integrated the `Sonner` global notification system (`Toaster`), configuring single-toast queueing (`visibleToasts={1}`) and customizable display durations.
- Verified and fixed CSS compatibility issues across Google Chrome, Mozilla Firefox .

Murad contribution details:

- Built the typed internationalization system with `LanguageContext`, `LanguageProvider`, and the shared translation catalogue.
- Added French, English, and Russian translations for navigation, authentication, profiles, settings, friends, chat, game modes, leaderboard, and match history.
- Added runtime validation for supported languages and explicit errors for missing translation keys.
- Persisted the selected language in browser local storage and connected it to the language selector in the main layout.
- Integrated localized labels and messages across pages and reusable game components through the `useLanguage` hook.

## Modules

Point rule:

- Major module = 2 points.
- Minor module = 1 point.

Current module list from the team planning:

| Module | Type | Points | Team member(s) | Implementation summary |
| --- | --- | ---: | --- | --- |
| Framework backend and frontend | Major | 2 | Mehdi | React/Vite frontend, NestJS backend, structured API/frontend separation. |
| User management and authentication | Major | 2 | Mehdi, Murad | Local auth, JWT cookies, `/auth/me`, profile/settings, 42 OAuth, 2FA. |
| Real-time features with WebSockets | Major | 2 | Paul, Mehdi | Socket.IO social and game namespaces, realtime chat, presence, game invites, multiplayer rooms. |
| User interaction | Major | 2 | Mehdi, Amine | Friends, private chat, profiles, online status, block system, frontend user interaction pages. |
| Public API with secured API key | Major | 2 | Murad | Independent public API for LolDle champion data, API-key auth, read/write permissions, rate limiting, documentation, and CRUD endpoints. |
| Multiplayer | Major | 2 | Paul | Ranked multiplayer game, matchmaking, turns, match state. |
| Remote players | Major | 2 | Paul | Remote multiplayer through Socket.IO game gateway. |
| ORM for database | Minor | 1 | Paul | Prisma ORM with PostgreSQL schema and migrations. |
| Gamification system | Minor | 1 | Murad | Rewards, XP/levels, Elo/ranked stats. |
| Multiple languages | Minor | 1 | Murad | French, English, Russian translations through frontend i18n context. |
| Remote authentication | Minor | 1 | Murad | 42 OAuth login and callback. |
| Custom-made design system | Minor | 1 | Amine | Custom UI components (`shadcn`/Tailwind), rich aesthetics, consistent visual styling. |
| Compatibility with at least 2 additional browsers | Minor | 1 | Amine | Tested and verified cross-browser compatibility across Google Chrome, Mozilla Firefox . |
| Game stats and match history | Minor | 1 | Murad | Match history pages and ranked statistics. |
| Advanced chat features | Minor | 1 | Mehdi | Persistent private chat, typing indicator, read receipts, block messages, game invites from chat, profile access. |
| Content moderation AI | Minor | 1 | Paul | TensorFlow toxicity model used to block toxic messages. |
| 2FA | Minor | 1 | Amine | Two-factor authentication frontend UI, QR Code generation modal, and two-step login verification flow (`requires2FA`). |

Total planned points: 24.

## Individual Contributions

### Mehdi

Main areas:

- Backend/frontend integration.
- User authentication and session flow.
- Users/profile/settings integration.
- Friends system.
- Private chat and advanced chat.
- Social socket integration.
- Project debugging and documentation support.

Detailed contribution:

- Worked on safe user responses:
  - public user shape;
  - no `password_hash` exposed to the frontend;
  - controlled `select`/`include` usage.
- Worked on local auth:
  - register DTO and validation;
  - duplicate username/email checks;
  - password hashing with `scrypt` and salt;
  - login with identifier/password;
  - Implement JWT authentication:
  - payload with user id in `sub`;
  - `JwtAuthGuard`;
  - `/auth/me`;
  - frontend `AuthContext`;
  - protected/guest routes.
- Integrated HTTP-only cookie session behavior:
  - backend sets/clears `access_token`;
  - frontend uses `credentials: 'include'`;
  - socket connections use `withCredentials`.
- Worked on profile/settings:
  - update profile;
  - update password;
  - profile access from chat.
- Built friends flow:
  - send friend request;
  - received requests;
  - accept requests;
  - delete friends;
  - block users;
  - friends API frontend integration.
- Built chat flow:
  - `Message` relation understanding;
  - `ChatService.sendMessage`;
  - `ChatService.getConversation`;
  - realtime messages through social socket;
  - persistent history through REST;
  - read receipts with `read_at`;
  - typing indicators;
  - message error handling;
  - block enforcement.
- Worked on social socket:
  - socket auth through cookies;
  - `client.data.userId`;
  - `user:<id>` rooms;
  - `friends_changed`;
  - `friend_status_changed`;
  - `send_message` / `message_received`;
  - `mark_message_read` / `message_read`;
  - `typing_start` / `typing_stop`;
  - `send_game_invite` / `accept_game_invite`;
  - logout/offline behavior.
- Helped identify and reason about integration issues:
  - refresh vs logout presence;
  - socket cleanup/listeners;
  - read receipts when the chat window is closed;
  - active match guard before game invitations.

Challenges:

- Understanding JWT, cookies, guards, React context, and Socket.IO as new concepts.
- Keeping backend security rules separate from frontend UI checks.
- Coordinating social socket behavior with the game socket.
- Debugging realtime state issues such as online/offline, duplicated events, and read receipts.

How they were addressed:

- Features were tested step by step with `curl`, browser sessions, two accounts, and Docker logs.
- Logic was kept in backend services where possible.
- REST and WebSocket responsibilities were separated:
  - REST for persistent CRUD/historical data;
  - WebSocket for realtime updates.

### Paul

Main areas:

- Backend & Frontend multiplayer architecture and game socket.
- Ranked matchmaking flow and turn-based guessing game loop.
- Remote player access setup (HTTPS & Zrok tunnel).
- Game modes (Daily Loldle and Infinite guessing modes).
- AI content moderation.
- Anticheat backend logic & security verification.
- PostgreSQL database health check, seeds, and Prisma integration.

Detailed contribution:

- **Multiplayer & Game Gateway**:
  - Implemented the `/game` namespace with Socket.IO on NestJS (`GameGateway`).
  - Handled multiplayer game loop, room creation, socket state, and player connections.
  - Implemented ranked matchmaking queue on the backend, pairing players into active games.
  - Integrated multiplayer gameplay UI cards, turn-based inputs, and state synchronization on the frontend.
- **Game Modes**:
  - Developed the Classic Daily Loldle mode.
  - Developed the Infinite guessing mode with full backend endpoints and state tracking.
  - Saved daily game progress in the client's LocalStorage to persist states on refresh.
  - Handled match victory screens with delay transitions.
- **Remote Access & Networking**:
  - Implemented tunnel-based remote player testing via Zrok (`42dle.shares.zrok.io`).
  - Set up and tested HTTPS support for the project.
- **Anticheat & Security**:
  - Implemented turn-verification on the backend to enforce valid guess orders and prevent exploits.
  - Disabled insecure REST endpoints (e.g. `getExactChampByID`) and secured the champion selection logic.
  - Avoided client-side champion detail leaks when a player is on their last attempt.
- **AI Content Moderation**:
  - Integrated `@tensorflow-models/toxicity` inside `ChatService`.
  - Configured categories like toxicity, insult, and threat validation with a threshold of 0.85 to block offensive messages automatically.
- **Infrastructure & Database**:
  - Wrote a database health check system to delay the backend container startup until PostgreSQL is ready.
  - Created and optimized Prisma schema and migrations for game tables.
  - Configured development shortcut commands in Makefile (e.g., `make re` which executes fclean and all) and resolved cookies cleanup bugs upon rebuild.

Challenges:

- Ensuring complete security against cheating attempts (like direct API queries or client-side metadata leaks) in a turn-based multiplayer structure.
- Integrating and managing dual Socket.IO namespaces (`/social` and `/game`) without conflicting handshakes.
- Resolving Docker start order dependencies where the NestJS container would fail if PostgreSQL was not fully ready to accept connections.

How they were addressed:

- Kept all critical validation, champion identities, and turn logic on the backend; the frontend only receives comparison results.
- Built a custom health check script in Docker/Docker Compose that polls the Postgres port before booting NestJS.
- Tested remote connectivity using tunnels to simulate actual network latency and cookie behaviors across different hosts.

### Amine

Main areas:

- Custom frontend design system and visual architecture (`shadcn`/Tailwind).
- Full UI/UX implementation across all pages and interactive components.
- Responsive multi-device layout across desktop, tablet, and mobile breakpoints (`Layout.tsx`).
- Avatar management (`AvatarPicker`) and dynamic initial fallbacks.
- Two-Factor Authentication (2FA) frontend setup, QR code generation modal, and two-step login flow (`requires2FA`).
- Global notification system (`Sonner` toasts).
- Cross-browser compatibility and UI testing across Google Chrome, Mozilla Firefox.

Detailed contribution:

- **Custom Design System & UI Architecture**:
  - Developed the custom design system using Vanilla CSS, Tailwind CSS, and `shadcn` / Radix UI inspired primitives (`Button`, `Input`, `Dialog`, `DropdownMenu`, `Avatar`, `Heading`).
  - Implemented the modern gaming/arcade aesthetic featuring glassmorphism, rich color palettes, micro-animations, and the `<DynamicBackground />` component.
  - Built the global navigation (`Layout.tsx`) with dynamic universe switching (`toggleUniverse`), user dropdown menu, and authenticated state handling.
- **Frontend Pages & Interactive Components**:
  - Created and polished all primary application views: `HomePage`, `LoginPage`, `RegisterPage`, `settingsPage`, `ProfilePage`, `FriendsList`, `MatchHistoryPage`, `LeaderboardPage`, and game interfaces (`ClassicGamePage`, `InfiniteGamePage`, `RankedGamePage`, `CountrydlePage`, `RankedLobbyPage`).
  - Integrated the visual structure of the real-time global chat (`GlobalChat.tsx`), including game invitation modals, user profile shortcuts, and typing indicators.
  - Implemented the `Sonner` toast notification system (`Toaster` in `Layout.tsx`), replacing static/native alerts with elegant floating notifications, configuring single-toast queues (`visibleToasts={1}`) and duration controls (`duration={4000}`).
- **Avatar Management System**:
  - Built the `AvatarPicker.tsx` modal in user settings allowing three flexible input methods: picking from a local gallery of default gaming avatars (`DEFAULT_AVATARS`), pasting a direct web image link, or uploading a local image file via `FileReader` base64 encoding.
  - Configured `<AvatarFallback>` to display the first letter of the user's username inside a stylized badge whenever an avatar is unassigned (`null`) or fails to load.
- **Two-Factor Authentication (2FA) Frontend Integration**:
  - Built the complete 2FA management interface in `settingsPage.tsx` and `two-factor.api.ts`.
  - Implemented the QR Code generation modal (`generateTwoFactorQrCode`), the initial 6-digit TOTP verification (`turnOnTwoFactor`), and the secure deactivation modal (`turnOffTwoFactor`).
  - Integrated the two-step login verification challenge in `LoginPage.tsx`: intercepting `{ requires2FA: true }` from the backend login response, dynamically rendering the Google Authenticator 6-digit input form, and calling `/2fa/authenticate` to finalize session cookie issuance.
- **Responsive Layouts & Cross-Browser Compatibility**:
  - Applied adaptive CSS grid and flexbox rules (`grid-cols-3 sm:grid-cols-4 md:grid-cols-5...`) to guarantee seamless navigation across all device screen sizes.
  - Tested, debugged, and verified cross-browser visual consistency and behavior across Google Chrome, Mozilla Firefox.

Challenges:

- Maintaining visual consistency across complex real-time states (chat, matchmaking, 2FA modals, and game boards) while keeping the UI responsive.
- Handling 2FA login state transitions smoothly without refreshing or losing user input when switching between email/password and TOTP verification screens.
- Managing various avatar formats (base64 uploads, external URLs, and local defaults) while preventing layout shifts or broken image icons.

How they were addressed:

- Standardized all UI building blocks through Radix UI and Tailwind utility tokens (`cn()`, `cva()`), avoiding ad-hoc inline styles.
- Built clean state transitions in `LoginPage.tsx` (`requires2FA` boolean state) to swap views instantly while keeping the temporary user ID (`tempUserId`) securely in memory.
- Combined Radix UI `<AvatarImage>` with `<AvatarFallback>` to ensure a seamless, professional fallback to the user's initial (`username.charAt(0).toUpperCase()`) whenever an image asset is missing.

### Murad

Main areas:

- Remote authentication with the 42 OAuth API.
- Gamification with XP, levels, daily rewards, streaks, and badges.
- Ranked statistics, Elo updates, and leaderboard.
- Match history frontend integration.
- Internationalization in French, English, and Russian.
- Countrydle game mode and country data.
- Secured public API for LolDle champion data.

Detailed contribution:

- **42 OAuth Authentication**:
  - Implemented the backend authorization and callback flow with the 42 API.
  - Exchanged the authorization code for a 42 access token and retrieved the authenticated user's profile.
  - Added lookup and creation of OAuth users with their 42 identifier, email, username, and avatar.
  - Prevented an OAuth account from silently replacing an existing local account with the same email.
  - Connected the frontend 42 callback page to session recovery after a successful OAuth login.
- **Gamification System**:
  - Created the gamification module, service, controller, and frontend API integration.
  - Implemented daily win rewards with XP based on the number of attempts.
  - Added consecutive-day streak tracking, best streak preservation, and streak bonuses.
  - Implemented automatic level calculation and exposed gamification statistics on user profiles.
  - Integrated rewards into the daily champion game flow and added badge progress to the profile interface.
- **Ranked Statistics & Leaderboard**:
  - Implemented Elo updates for multiplayer victories, defeats, and draws.
  - Updated ranked win/loss counters when a ranked match is resolved.
  - Added a top-10 leaderboard endpoint ordered by Elo and connected it to the leaderboard page.
- **Match History**:
  - Connected the authenticated match-history API to the frontend.
  - Displayed the opponent, result, Elo variation, avatar, and localized match date for each ranked game.
- **Internationalization**:
  - Built the typed React language context and translation lookup system.
  - Added French, English, and Russian translations across navigation, authentication, profiles, social features, game pages, settings, leaderboard, and match history.
  - Persisted the selected language in browser local storage and integrated the language selector into the main layout.
- **Countrydle**:
  - Implemented the country guessing mode with country suggestions, duplicate-guess prevention, comparison feedback, and victory handling.
  - Added the country API integration, daily country match logic, Prisma models/migration, and country seed data.
- **Public API**:
  - Created an independent `PublicApiModule` for external access to LolDle champion data.
  - Added secured API-key authentication that stays separate from JWT/cookie authentication.
  - Added separate read and write API permissions so destructive actions require the write key.
  - Implemented public CRUD endpoints for champions with DTO validation and safe public field selection.
  - Added rate limiting for public API requests and documented usage in `docs/public-api.md`.

Challenges:

- Linking an external OAuth identity to the local user model without exposing tokens or creating duplicate accounts.
- Keeping XP, streak, Elo, and ranked statistics consistent when several game modes update user data.
- Maintaining complete and type-safe translations across a growing number of pages and reusable components.
- Representing country attributes consistently between seed data, backend comparisons, API types, and the frontend grid.

How they were addressed:

- Kept the OAuth code exchange and 42 profile request on the backend, then reused the existing JWT cookie session flow.
- Centralized rewards and Elo calculations in `GamificationService` and used Prisma transactions for paired ranked updates.
- Used a single typed translation catalogue and `LanguageContext` so missing keys are detected instead of silently falling back.
- Shared typed API structures and reusable game components for Countrydle suggestions, guesses, history, and victory states.

## Security Notes

- The frontend is not trusted for authorization.
- The backend checks authenticated user identity using JWT/cookies.
- HTTP routes use guards such as `JwtAuthGuard`.
- Socket gateways authenticate connections during the handshake.
- Chat and game actions use backend services to enforce rules.
- Sensitive fields such as `password_hash` and 2FA secrets should never be returned to the frontend.
- HTTP-only cookies reduce direct token exposure to frontend JavaScript.

## Resources

Official documentation and references:

- 42 ft_transcendence subject PDF.
- NestJS documentation: https://docs.nestjs.com/
- NestJS WebSockets: https://docs.nestjs.com/websockets/gateways
- Socket.IO documentation: https://socket.io/docs/v4/
- React documentation: https://react.dev/
- React Router documentation: https://reactrouter.com/
- Prisma documentation: https://www.prisma.io/docs
- PostgreSQL documentation: https://www.postgresql.org/docs/
- Docker documentation: https://docs.docker.com/
- Nginx documentation: https://nginx.org/en/docs/
- Tailwind documentation: https://tailwindcss.com/docs/installation/using-vite
- chadcn UI components documentations https://ui.shadcn.com/docs
- JWT introduction: https://jwt.io/introduction
- 42 OAuth/API documentation: https://api.intra.42.fr/apidoc
- class-validator documentation: https://github.com/typestack/class-validator
- TensorFlow.js toxicity model: https://github.com/tensorflow/tfjs-models/tree/master/toxicity

AI usage:

- AI tools such as ChatGPT/Codex - Gemini/AntiGravity were used as programming assistants during development.
- AI was used to:
  - explain unfamiliar concepts such as DTOs, JWT, guards, cookies, Prisma relations, React Context, and Socket.IO;
  - help debug integration issues;
  - review code snippets and point out mistakes;
- AI was not treated as the source of truth for project rules or security decisions.
- Final code decisions, testing, integration, and responsibility remained with the team.
- The README was assisted by AI.

## License / Credits

This project was developed for educational purposes as part of the 42 curriculum.
