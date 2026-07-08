import { API_BASE_URL } from "../config/api";
import type { AuthUser } from "./auth.api";


// Ask the backend to generate a 2FA secret and return the QR Code image as Base64
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


 // Validate the first 6-digit code to permanently enable 2FA on the account

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

// Disable 2FA by verifying the 6-digit code

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

// Submit the 2FA code during login to complete authentication

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
