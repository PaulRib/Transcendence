import { API_BASE_URL } from "../config/api";
import type { AuthUser } from "./auth.api";


//Demande au backend de générer un secret 2FA et de renvoyer l'image QR Code en Base64
export async function generateTwoFactorQrCode(): Promise<{ qrCodeDataUrl: string; secret?: string }> {
  const response = await fetch(`${API_BASE_URL}/2fa/generate`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la génération du QR Code 2FA");
  }

  return response.json();
}


 // Valide le premier code à 6 chiffres pour activer définitivement la 2FA sur le compte

export async function turnOnTwoFactor(code: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/2fa/turn-on`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || "Code 2FA invalide lors de l'activation");
  }

  return response.json();
}

//Désactive la 2FA en vérifiant le code à 6 chiffres

export async function turnOffTwoFactor(code: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/2fa/turn-off`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || "Code 2FA invalide lors de la désactivation");
  }

  return response.json();
}

//Saisir le code 2FA lors de la connexion pour finaliser le Login

export async function authenticateTwoFactorLogin(userId: string, code: string): Promise<{ user: AuthUser }> {
  const response = await fetch(`${API_BASE_URL}/2fa/authenticate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ userId, code }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || "Code 2FA incorrect");
  }

  return response.json();
}
