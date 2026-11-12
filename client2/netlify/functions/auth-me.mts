import type { Config } from "@netlify/functions";
import { getCurrentUser } from "../lib/auth.mts";

export default getCurrentUser;

export const config: Config = {
  path: "/api/auth/me",
};
