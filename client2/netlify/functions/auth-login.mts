import type { Config } from "@netlify/functions";
import { signIn } from "../lib/auth.mts";

export default signIn;

export const config: Config = {
  path: "/api/auth/login",
};
