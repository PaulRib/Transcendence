After cloning, you must run `npm install` on both the backend and the frontend. @Murad @Amine @Paul @Mehdi !!!
Run `npm install @prisma/client` and `npx prisma generate` if you have some errors on VScode.

General direction !!!

Usage of github : 
The main is only to a ready to use product, everything need to work and be testing BEFORE merging to the main.
Each service, each different portion of the project need to have his own branch. 
Try, at best, to have one commit per files, to assure clear commit messages for others

Framework used :
Frontend -> React(JavaScript/Typescript)
Backend -> NestJS(Typescript)
BDD -> PostgreSQL

TO DO LIST:
- GENERAL Readme to do
- MCD
- Fix cookie
- Test route

Modules done :
- Major : Framework backend & frontend (Mehdi)
- Major : User management and authentication (Mehdi, Murad)
- Major : Real-time features (WebSockets) (Paul, Mehdi)
- Major : Users interaction (basic chat, profile, friends) (Mehdi, Amine)
- Major : Multiplayer (Paul)
- Major : Remote players (Paul)
- Minor : ORM for database (Paul)
- Minor : gamification system (Murad)
- Minor : Multiple languages (at least 3) (Murad)
- Minor : Remote authentication (Murad)
- Minor : Custom-made design system (Amine)
- Minor : Compability with at least 2 additional browsers (Amine)
- Minor : Game stats and match history (Murad)
- Minor : Advanced chat feature (Mehdi)
- Minor : Content moderation AI (Paul)
- Minor : 2FA (Amine)

Team :
- Mehdi : 4 Majors - 1 Minor
- Paul : 3 Majors - 2 Minors
- Amine : 1 Major - 3 Minors
- Murad : 1 Major - 4 Minors

Total Point : 22 points
