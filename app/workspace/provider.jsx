"use client";

import React from "react";
import WorkspaceNavbar from "./_components/WorkspaceNavbar";
import { DashboardProvider } from "../../context/DashboardContext";

function WorkspaceProvider({ children }) {
  return (
    <DashboardProvider>
      <div className='w-full min-h-screen flex flex-col'>
        <WorkspaceNavbar />
        <div className='flex-1 p-6 md:p-10'>
          {children}
        </div>
      </div>
    </DashboardProvider>
  );
}

export default WorkspaceProvider;
