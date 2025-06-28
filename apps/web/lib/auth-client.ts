import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const authClient: AuthClient = createAuthClient({
  /** the base url of the server (optional if you're using the same domain) */
  baseURL: "http://localhost:3000",
  fetchOptions: {
    onError: (error) => {
      toast.error(error.error.message);
    },
  },
});

export const { useSession, signOut } = authClient;
