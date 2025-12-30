"use client"
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { UserDetailContext } from "../context/UserDetailContext";
import {SelectedChapterIndexContext} from "../context/SelectedChapterIndexContext";
import { FocusTimerProvider } from "../context/FocusTimerContext";
import { ThemeProvider } from "next-themes";
import { GlobalFocusBadge } from "./_components/GlobalFocusBadge";
import { GlobalFocusAlert } from "./_components/GlobalFocusAlert";

function Provider({ children }) {
    const {user} = useUser();
    const [userDetail,setUserDetail]=useState();
    const [selectedChapterIndex,setSelectedChapterIndex] = useState(0);
    useEffect(()=>{
        user && CreateNewUsers();
    },[user])

    const CreateNewUsers=async() =>{
        try {
            const result = await axios.post('/api/user',{
                name:user?.fullName,
                email:user?.primaryEmailAddress?.emailAddress
            });
            console.log(result.data);
            setUserDetail(result.data);
        } catch (error) {
            console.error("Error creating user:", error);
            setUserDetail({
                email: user?.primaryEmailAddress?.emailAddress,
                name: user?.fullName
            });
        }
    };

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <FocusTimerProvider>
                <UserDetailContext.Provider value={{ userDetail,setUserDetail }}>
                    <SelectedChapterIndexContext.Provider value={{ selectedChapterIndex,setSelectedChapterIndex }}>
                        <div>{children}</div>
                        <GlobalFocusBadge />
                        <GlobalFocusAlert />
                    </SelectedChapterIndexContext.Provider>
                </UserDetailContext.Provider>
            </FocusTimerProvider>
        </ThemeProvider>
        )
}

export default Provider