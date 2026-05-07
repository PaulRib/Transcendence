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
| `await` | Attend le résulta
