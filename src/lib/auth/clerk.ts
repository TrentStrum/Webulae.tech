import { clerkClient } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs";

export async function getCurrentUser() {
  try {
    const { userId } = auth();
    if (!userId) return null;

    const user = await clerkClient.users.getUser(userId);
    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function getUserRole() {
  try {
    const { userId } = auth();
    if (!userId) return null;

    const user = await clerkClient.users.getUser(userId);
    return user.publicMetadata.role || "client";
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
}