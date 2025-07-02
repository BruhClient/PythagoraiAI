import { PricingPlanName } from "@/data/pricingPlans";
import { DefaultSession } from "next-auth";

type UserRole = (typeof User)["role"];
export type ExtendedUser = DefaultSession["user"] & {
  id: string;
  name: string;
  image: string;
  isOauth: boolean;
  gems: number;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
