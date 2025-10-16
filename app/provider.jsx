"use client"
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { UserDetailContext } from "../context/UserDetailContext";
import {SelectedChapterIndexContext} from "../context/SelectedChapterIndexContext";
import { ThemeProvider } from "next-themes";
function Provider({ children }) {
    const {user} = useUser();
    const [userDetail,setUserDetail]=useState();
    const [selectedChapterIndex,setSelectedChapterIndex] = useState(0);
    useEffect(()=>{
        user && CreateNewUsers();
    },[user])

    const CreateNewUsers=async() =>{
        const result = await axios.post('/api/user',{
            name:user?.fullName,
            email:user?.primaryEmailAddress?.emailAddress
        });
        console.log(result.data);
        setUserDetail(result.data);
    };
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <UserDetailContext.Provider value={{ userDetail,setUserDetail }}>
                <SelectedChapterIndexContext.Provider value={{ selectedChapterIndex,setSelectedChapterIndex }}>
                    <div>{children}</div>
                </SelectedChapterIndexContext.Provider>
            </UserDetailContext.Provider>
        </ThemeProvider>
        )
}

export default Provider