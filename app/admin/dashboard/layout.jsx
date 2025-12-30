import { redirect } from "next/navigation";
import { getAdminUser } from "../../../@/lib/admin";
import AdminLayoutClient from "./_components/AdminLayoutClient";

export default async function AdminDashboardLayout({ children }) {
  const admin = await getAdminUser();
  
  if (!admin) {
    redirect("/sign-in");
  }

  return <AdminLayoutClient admin={admin}>{children}</AdminLayoutClient>;
}
