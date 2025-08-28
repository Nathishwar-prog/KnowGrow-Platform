"use client"
import React, { use } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../../../@/components/ui/sidebar"
import Image from 'next/image';
import {Button}  from "../../../@/components/ui/button";
import { LayoutDashboard,Book, WalletCards, PencilRulerIcon, Compass, UserCircle2Icon} from "lucide-react";
import Link from "next/link"
import { usePathname } from "next/navigation";
import AddNewCourseDialog from "./AddNewCourseDialog";


const SideBarOptions=[
  {
    title:'Dashboard',
    icon:LayoutDashboard,
    path:'/workspace'
  },
    {
    title:'My Learning',
    icon:Book,
    path:'/workspace/my-learning'
  },
    {
    title:'Explore Courses',
    icon:Compass,
    path:'/workspace/explore'
  },
    {
    title:'Ai Tools',
    icon:PencilRulerIcon,
    path:'/workspace/ai-tools'
  },
    {
    title:'Billing',
    icon:WalletCards,
    path:'/workspace/billing'
  },
    {
    title:'Profile',
    icon:UserCircle2Icon,
    path:'/workspace/profile'
  }
]

function AppSidebar(){
    const path= usePathname();
    return (
        <Sidebar>
          <SidebarHeader className={'p-4'}>
            <Image src={'/logo.svg'} alt='logo' width={60} height={80}/>
          </SidebarHeader>
          <SidebarContent>
              <SidebarGroup> 
                <AddNewCourseDialog>
                    <Button>Create New Course</Button>
                </AddNewCourseDialog> 
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {SideBarOptions.map((item,index)=>(
                      <SidebarMenuItem key={index} >
                        <SidebarMenuButton asChild className={'p-5'}>
                          <Link href={item.path} className={`text-[17px]
                          ${path.includes(item.path)&&'text-primary font-bold bg-purple-50'}`}>
                            
                            
                              <item.icon className='h-7 w-7'/>
                              <span className='ml-2'>{item.title}</span>
                            
                          </Link>
                          
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
          </SidebarContent>
          <SidebarFooter />
    </Sidebar>
    )
}
export default AppSidebar;