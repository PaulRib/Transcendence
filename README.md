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
- Tracking lose / Add lose-win in profile / Replace points by elo in match history (Murad)
- End Countrydle (Murad)
- Fix security of reward distribution (Murad)
- Traduction for Global Chat and Ranked Lobby (Murad)
- Netherlands Antilles/ Serbia to check, overall check country data (Murad)
- 2FA (Amine)
- Profile picture to check (Amine)
- Put level back in ProfilePage (Amine)
- Remove delete button in parameters and chat/game button in friends (Amine)
- Finish chat advanced (Mehdi)
- Add blocked friend (Mehdi)
- Content Moderation AI to check (Paul)
- GENERAL Readme to do

Modules done :
- Major : Framework backend & frontend -> Done (Mehdi)
- Major : User management and authentication -> Done (Mehdi)
- Major : Real-time features (WebSockets) -> Done (Paul)
- Major : Users interaction (basic chat, profile, friends) -> Done (Mehdi)
- Major : Multiplayer -> Done (Paul)
- Major : Remote players -> Done (Paul)
- Minor : ORM for database -> Done (Paul)
- Minor : gamification system -> Done (Murad)
- Minor : Multiple languages (at least 3) -> Done (Murad)
- Minor : Remote authentication -> (Murad)
- Minor : Custom-made design system -> Done (Amine)
- Minor : Compability with at least 2 additional browsers -> Done
- Minor : Game stats and match history -> almost done (Murad)

In progress :
- Minor : Advanced chat feature (Mehdi)

To validate :
- Minor : Content moderation AI
- Minor : 2FA 

Total Point
- Already done : 19 points
- In progress : 22 points
