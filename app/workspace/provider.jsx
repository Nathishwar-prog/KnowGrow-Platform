import { Sidebar } from "lucide-react";
import React from "react";
import { SidebarProvider, SidebarTrigger } from "../../@/components/ui/sidebar";
import AppSidebar from "./_components/AppSidebar";
import WorkspaceNavbar from "./_components/WorkspaceNavbar";

function WorkspaceProvider({ children }) {
  return (
    <div className='w-full min-h-screen flex flex-col'>
      <WorkspaceNavbar />
      <div className='flex-1 p-6 md:p-10'>
        {children}
      </div>
    </div>
  );
}

export default WorkspaceProvider;