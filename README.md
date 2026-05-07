# 🚀 React + NestJS — Notes de projet

<div align="center">

![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=0B1220)
![NestJS](https://img.shields.io/badge/Backend-NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Security](https://img.shields.io/badge/Security-Backend_First-10B981?style=for-the-badge&logo=shield&logoColor=white)

</div>

---

## 🧭 Architecture générale

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>🎨 Frontend React</h3>
      <p>Le frontend gère toute la partie visible et interactive de l’application.</p>
      <ul>
        <li>Affichage</li>
        <li>Interface utilisateur</li>
        <li>Appels API</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>🧠 Backend NestJS</h3>
      <p>Le backend contient la logique importante et sécurisée de l’application.</p>
      <ul>
        <li>Logique métier</li>
        <li>Base de données</li>
        <li>Sécurité</li>
        <li>Validation</li>
        <li>Authentification</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🔐 Règle importante

> [!WARNING]
> Le frontend n’est jamais digne de confiance.
>
> Les validations importantes doivent être faites côté backend.

---

# ⚛️ Frontend React

---

## 🟦 `useState`

`useState` permet de stocker une donnée React qui peut changer.

```tsx
const [status, setStatus] = useState('loading');
```

| Élément | Rôle |
|---|---|
| `status` | Valeur actuelle |
| `setStatus()` | Setter React qui modifie la valeur |

> Quand le state change, React ré-affiche automatiquement le composant.

---

## 🟪 `useEffect`

`useEffect` permet d’exécuter du code après l’affichage du composant.

```tsx
useEffect(() => {
  // code
}, []);
```

Avec `[]` :

```tsx
useEffect(() => {
  // code exécuté une seule fois
}, []);
```

### Utilisations fréquentes

- Fetch API
- Chargement de données
- WebSockets
- Timers

---

## 🟧 `fetch`

`fetch` envoie une requête HTTP au backend.

```tsx
const response = await fetch('http://localhost:3000/api/health');
```

Équivalent frontend de :

```bash
curl http://localhost:3000/api/health
```

---

## 🟨 `async / await`

`async / await` est utilisé pour les opérations asynchrones.

```tsx
async function test() {
  const response = await fetch('http://localhost:3000/api/health');
}
```

| Mot-clé | Rôle |
|---|---|
| `async` | Fonction asynchrone |
| `await` | Attend le résultat avant de continuer |

---

## 🟩 `response.ok`

`response.ok` vérifie si la réponse HTTP est correcte.

```tsx
if (!response.ok) {
  throw new Error('Request failed');
}
```

| Valeur | Signification |
|---|---|
| `true` | HTTP OK `200-299` |
| `false` | Erreur HTTP `404`, `500`, etc. |

---

## 🟥 `return React`

Le `return` d’un composant React retourne ce qui sera affiché à l’écran.

```tsx
return (
  <div>
    <h1>Hello React</h1>
  </div>
);
```

---

# 🧠 Backend NestJS

---

## 🟥 `main.ts`

`main.ts` est le point d’entrée du backend NestJS.

C’est le fichier qui démarre l’application.

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: 'http://localhost:5173',
  });

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
```

| Élément | Rôle |
|---|---|
| `NestFactory.create(AppModule)` | Crée l’application Nest à partir du module principal |
| `setGlobalPrefix('api')` | Ajoute `/api` devant toutes les routes |
| `enableCors()` | Autorise le frontend à appeler le backend |
| `listen()` | Lance le serveur backend |

### Exemple

```txt
/health
```

devient :

```txt
/api/health
```

---

## 🧩 Module

Un module sert à organiser le backend par responsabilité.

### Exemples

- `HealthModule`
- `UsersModule`
- `ChampionsModule`
- `AuthModule`
- `GameModule`

### Structure classique

```txt
users/
  users.module.ts
  users.controller.ts
  users.service.ts
```

```ts
@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

| Élément | Rôle |
|---|---|
| `controllers` | Liste les controllers du module |
| `providers` | Liste les services utilisables dans le module |
| `imports` | Permet d’utiliser d’autres modules |
| `exports` | Permet à d’autres modules d’utiliser un service |

> Un module ne doit pas devenir un fourre-tout.  
> Il doit représenter une responsabilité claire.

---

## 🎮 Controller

Le controller reçoit les requêtes HTTP.

Il ne doit pas contenir toute la logique métier. Son rôle principal est de recevoir la requête et d’appeler le service.

```ts
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }
}
```

| Élément | Rôle |
|---|---|
| `@Controller('users')` | Définit la base de la route |
| `@Get(':id')` | Définit une route `GET` avec un paramètre |
| `@Param('id')` | Récupère le paramètre dans l’URL |
| `usersService` | Appelle la logique du service |

Avec le préfixe `/api`, cette route devient :

```http
GET /api/users/:id
```

---

## ⚙️ Service

Le service contient la logique métier.

C’est ici qu’on met le code important :

- Recherche d’un utilisateur
- Appel à la DB
- Règles métier
- Vérifications
- Erreurs

```ts
@Injectable()
export class UsersService {
  getUserById(id: string) {
    const foundUser = this.users.find((user) => user.id === id);

    if (!foundUser) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }

    return foundUser;
  }
}
```

| Élément | Rôle |
|---|---|
| `@Injectable()` | Rend le service injectable dans Nest |
| `getUserById()` | Méthode de logique métier |
| `throw new NotFoundException()` | Renvoie une erreur HTTP `404` propre |

---

## 🚨 Exceptions NestJS

NestJS fournit des exceptions propres pour les erreurs HTTP.

```ts
throw new NotFoundException('User not found');
```

### Réponse HTTP

```json
{
  "message": "User not found",
  "error": "Not Found",
  "statusCode": 404
}
```

### Exceptions fréquentes

| Exception | Code HTTP | Utilisation |
|---|---:|---|
| `NotFoundException` | `404` | Ressource introuvable |
| `BadRequestException` | `400` | Requête invalide |
| `UnauthorizedException` | `401` | Utilisateur non connecté |
| `ForbiddenException` | `403` | Utilisateur sans permission |
| `InternalServerErrorException` | `500` | Erreur serveur |

> Éviter les simples `throw new Error()` pour les erreurs HTTP attendues.

---

## 👤 Type public de réponse

Il ne faut jamais renvoyer directement un objet DB complet au frontend.

```ts
export type PublicUser = {
  id: string;
  username: string;
  avatar_url: string | null;
};
```

### Objectifs

- Contrôler ce qu’on expose au frontend
- Éviter d’envoyer des données sensibles
- Garder une API propre

### Données à ne jamais exposer directement

- Mot de passe
- Hash de mot de passe
- Secret 2FA
- Tokens
- Données internes
- Permissions sensibles

---

## 🗄️ Prisma

Prisma sert à communiquer avec PostgreSQL.

```txt
Backend NestJS
    ↓
Prisma
    ↓
PostgreSQL
```

### Responsabilités principales

- Modèles de données
- Requêtes DB
- Relations
- Migrations
- Seed de données

### Exemple de modèle

```prisma
model User {
  id       String @id @default(uuid())
  username String @unique
  email    String @unique
}
```

> Prisma ne remplace pas PostgreSQL.  
> PostgreSQL reste la vraie base de données.

---

## 🔁 Controller → Service → DB

Chemin classique d’une requête backend :

1. Le frontend appelle une route
2. Le controller reçoit la requête
3. Le controller appelle le service
4. Le service applique la logique métier
5. Le service peut interroger Prisma / DB
6. Le backend renvoie une réponse JSON

```txt
GET /api/users/1
UsersController
    ↓
UsersService
    ↓
Prisma / DB
    ↓
Réponse JSON
```

---

## 🔐 Sécurité backend

Le backend est responsable des règles importantes.

### Toujours vérifier côté backend

- Identité de l’utilisateur
- Permissions
- Validation des données
- Accès aux ressources
- Données envoyées à la DB
- Données renvoyées au frontend

> Même si le frontend cache un bouton ou bloque une action,  
> le backend doit quand même vérifier les droits.

---

# 🧩 Résumé rapide

| Concept | Utilité |
|---|---|
| `useState` | Stocker une donnée qui change |
| `useEffect` | Lancer du code après l’affichage |
| `fetch` | Appeler une API backend |
| `async / await` | Gérer du code asynchrone |
| `response.ok` | Vérifier le succès HTTP |
| `return` | Afficher du JSX |
| `main.ts` | Démarrer l’application NestJS |
| `Module` | Organiser une responsabilité backend |
| `Controller` | Recevoir les requêtes HTTP |
| `Service` | Contenir la logique métier |
| `Prisma` | Communiquer avec la base de données |
| `Backend` | Vérifier la sécurité |

---

# ✅ À retenir

<div align="center">

### Le frontend affiche.  
### Le controller reçoit.  
### Le service réfléchit.  
### Prisma parle à la DB.  
### Le backend vérifie la sécurité.

<br />

🐺

</div>
