import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { API_BASE_URL } from "./api-url";

export const authClient = createAuthClient({
  ...(API_BASE_URL ? { baseURL: API_BASE_URL } : {}),
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
