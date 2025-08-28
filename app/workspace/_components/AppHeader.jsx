import { UserButton } from "@clerk/nextjs";
import { SidebarTrigger } from "../../../@/components/ui/sidebar";
import React from "react";
function Appheader({hideSidebar=false}){
    return (
        <div className='p-4 flex justify-between items-center shadow-sm border-b sticky top-0 bg-white z-50'> 
            {!hideSidebar && <SidebarTrigger />}
            <UserButton/>
            
        </div>
    )
}

export default Appheader;