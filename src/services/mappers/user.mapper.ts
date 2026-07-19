import type { User } from "firebase/auth";
import type { UserProfile } from "@/types";

export const mapFirebaseUserToProfile = (user: User): UserProfile => ({
  id: user.uid,
  name: user.displayName ?? "",
  rollNo: "",
  email: user.email ?? "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});