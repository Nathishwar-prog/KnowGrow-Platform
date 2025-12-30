import React from "react";
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