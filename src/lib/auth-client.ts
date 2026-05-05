import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

// Auth MUST always talk directly to the backend URL — never through the Next.js proxy.
// Using the proxy causes state_mismatch because the state cookie is set on the backend
// domain during sign-in initiation, but the proxy forwards the callback without that cookie.
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://food-hub-backend-server.vercel.app";

export const authClient = createAuthClient({
  baseURL: BACKEND_URL,
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
          required: false,
        },
        phone: {
          type: "string",
          required: false,
        },
        status: {
          type: "string",
          required: false,
        },
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
