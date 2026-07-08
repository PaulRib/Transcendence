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
- Multiple languages.
- Custom frontend design system.
- PostgreSQL database managed through Prisma ORM.
- Docker-based deployment with a reverse proxy.

## Team Information

| Team member | 42 login | Assigned role(s) | Main responsibilities |
| Mehdi | `<meel-war>` | Product Owner, Technical Lead, Developer, backend/frontend integration, auth/social/chat contributor | Authentication flow, users/profile integration, friends system, global chat integration, social socket integration, real-time chat features, game invitations through social socket, read receipts, typing indicator, project understanding/documentation support. |
| Paul | `<pribolzi>` | Product Owner, Project Manager, Developer, gameplay/multiplayer contributor | Multiplayer game logic, ranked match flow, game socket, remote players, content moderation AI, parts of database/gameplay integration. TODO: confirm exact scope. |
| Amine | `<mbenzira>` | Developer, frontend/design contributor | Visual interface, custom design system, browser compatibility, 2FA UI/integration support, UI polish. TODO: confirm exact scope. |
| Murad | `<mubersan>` | Developer, gamification/auth contributor | Gamification, leaderboard/statistics, match history, remote authentication with 42, multiple languages. TODO: confirm exact scope. |

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
FRONTEND_URL=http://localhost:5173
FORTYTWO_CLIENT_ID=<your_42_client_id>
FORTYTWO_CLIENT_SECRET=<your_42_client_secret>
FORTYTWO_CALLBACK_URL=http://localhost:3000/api/auth/42/callback
NGROK_AUTHTOKEN=<your_ngrok_token>
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
- 2FA support. (Amine)
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

### Friends and user interaction

Implemented by: Mehdi, Amine.

- Send friend requests. (Mehdi)
- Receive friend requests. (Medi)
- Accept requests. (Mehdi)
- Delete friends. (Mehdi)
- Block users. (Mehdi)
- Online/offline status display. (Mehi)
- Realtime friend list refresh with `friends_changed`. (Mehdi)

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

### Multiplayer game

Implemented by: Paul.

- Ranked matchmaking.
- Remote players.
- Game rooms.
- Turn-based guessing.
- Match creation and match end.
- Reconnection/forfeit handling.
- Match history data.

### Gamification and statistics

Implemented by: Murad.

- Elo/ranking data.
- Ranked wins/losses.
- Leaderboard.
- Daily rewards / XP / level data.
- Match history.

### Game modes and data

Implemented by: Paul, Murad, other contributors. TODO: confirm exact split.

- Classic champion guessing mode.
- Infinite champion guessing mode.
- Ranked multiplayer mode.
- Countrydle mode.
- Champion and country seed data.

### Frontend UI and design

Implemented by: Amine, with integration work by the rest of the team. TODO: confirm exact split.

- Custom UI style.
- Responsive layout.
- Global navigation.
- Global chat component.
- Game pages.
- Profile/settings/friends UI.
- Multilingual text integration.
- Browser compatibility work.

## Modules

Point rule:

- Major module = 2 points.
- Minor module = 1 point.

Current module list from the team planning:

| Module | Type | Points | Team member(s) | Implementation summary |
| --- | --- | ---: | --- | --- |
| Framework backend and frontend | Major | 2 | Mehdi | React/Vite frontend, NestJS backend, structured API/frontend separation. TODO: confirm shared contribution. |
| User management and authentication | Major | 2 | Mehdi, Murad | Local auth, JWT cookies, `/auth/me`, profile/settings, 42 OAuth, 2FA. |
| Real-time features with WebSockets | Major | 2 | Paul, Mehdi | Socket.IO social and game namespaces, realtime chat, presence, game invites, multiplayer rooms. |
| User interaction | Major | 2 | Mehdi, Amine | Friends, private chat, profiles, online status, block system, frontend user interaction pages. |
| Multiplayer | Major | 2 | Paul | Ranked multiplayer game, matchmaking, turns, match state. |
| Remote players | Major | 2 | Paul | Remote multiplayer through Socket.IO game gateway. |
| ORM for database | Minor | 1 | Paul | Prisma ORM with PostgreSQL schema and migrations. TODO: confirm exact owner. |
| Gamification system | Minor | 1 | Murad | Rewards, XP/levels, Elo/ranked stats. |
| Multiple languages | Minor | 1 | Murad | French, English, Russian translations through frontend i18n context. |
| Remote authentication | Minor | 1 | Murad | 42 OAuth login and callback. |
| Custom-made design system | Minor | 1 | Amine | Custom UI components, consistent visual styling. |
| Compatibility with at least 2 additional browsers | Minor | 1 | Amine | Browser testing and fixes. TODO: list tested browsers. |
| Game stats and match history | Minor | 1 | Murad | Match history pages and ranked statistics. |
| Advanced chat features | Minor | 1 | Mehdi | Persistent private chat, typing indicator, read receipts, block messages, game invites from chat, profile access. |
| Content moderation AI | Minor | 1 | Paul | TensorFlow toxicity model used to block toxic messages. TODO: confirm owner/details. |
| 2FA | Minor | 1 | Amine | Two-factor authentication using OTP and QR code. TODO: confirm exact split. |

Total planned points: 22.

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

- Helped move `UsersService` from mock-like behavior to Prisma/PostgreSQL-backed user access.
- Worked on safe user responses:
  - public user shape;
  - no `password_hash` exposed to the frontend;
  - controlled `select`/`include` usage.
- Worked on local auth:
  - register DTO and validation;
  - duplicate username/email checks;
  - `409 Conflict` behavior;
  - password hashing with `scrypt` and salt;
  - login with identifier/password;
  - invalid credentials as `401 Unauthorized`.
- Helped implement JWT authentication:
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
  - avatar URL handling;
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

TODO: complete with Paul.

Possible areas to verify:

- Multiplayer game logic.
- Game Socket.IO gateway.
- Matchmaking and remote players.
- Content moderation AI.
- Prisma/game data integration.

### Amine

TODO: complete with Amine.

Possible areas to verify:

- Custom frontend design system.
- UI implementation and polish.
- Browser compatibility.
- 2FA UI/integration.

### Murad

TODO: complete with Murad.

Possible areas to verify:

- 42 OAuth.
- Gamification.
- Leaderboard.
- Match history.
- Multiple languages.

## Security Notes

- The frontend is not trusted for authorization.
- The backend checks authenticated user identity using JWT/cookies.
- HTTP routes use guards such as `JwtAuthGuard`.
- Socket gateways authenticate connections during the handshake.
- Chat and game actions use backend services to enforce rules.
- Sensitive fields such as `password_hash` and 2FA secrets should never be returned to the frontend.
- HTTP-only cookies reduce direct token exposure to frontend JavaScript.

## Known Limitations / TODO

> TODO: review with the whole team before final submission.

- Some team responsibilities and exact 42 logins still need to be filled in.
- Browser compatibility section must list the exact tested browsers.
- Project management tools and communication channels must be confirmed.
- The final README should replace placeholders before submission.
- Some game-related edge cases should be verified with two real browser sessions.
- If the final deployed URL differs from local Docker URLs, update the Instructions section.

## Resources

Official documentation and references:

- 42 ft_transcendence subject PDF.
- NestJS documentation: https://docs.nestjs.com/
- NestJS WebSockets: https://docs.nestjs.com/websockets/gateways
- Socket.IO documentation: https://socket.io/docs/v4/
- React documentation: https://react.dev/
- Vite documentation: https://vite.dev/
- React Router documentation: https://reactrouter.com/
- Prisma documentation: https://www.prisma.io/docs
- PostgreSQL documentation: https://www.postgresql.org/docs/
- Docker documentation: https://docs.docker.com/
- Nginx documentation: https://nginx.org/en/docs/
- JWT introduction: https://jwt.io/introduction
- OWASP Authentication Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
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

TODO: add license choice if the team wants to publish the project publicly.
