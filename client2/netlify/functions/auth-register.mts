import type { Config } from "@netlify/functions";
import { register } from "../lib/auth.mts";

export default register;

export const config: Config = {
  path: "/api/auth/register",
};
