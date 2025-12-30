import { auth, currentUser } from "@clerk/nextjs/server";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean);

export async function isAdmin() {
  const { userId } = await auth();
  if (!userId) return false;
  
  const user = await currentUser();
  if (!user?.emailAddresses?.[0]?.emailAddress) return false;
  
  const email = user.emailAddresses[0].emailAddress.toLowerCase();
  return ADMIN_EMAILS.includes(email);
}

export async function getAdminUser() {
  const { userId } = await auth();
  if (!userId) return null;
  
  const user = await currentUser();
  if (!user?.emailAddresses?.[0]?.emailAddress) return null;
  
  const email = user.emailAddresses[0].emailAddress.toLowerCase();
  if (!ADMIN_EMAILS.includes(email)) return null;
  
  return {
    id: userId,
    email: email,
    name: user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : email,
    imageUrl: user.imageUrl
  };
}

export async function requireAdmin() {
  const admin = await getAdminUser();
  if (!admin) {
    throw new Error("Unauthorized: Admin access required");
  }
  return admin;
}
