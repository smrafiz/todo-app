"use client";

import {useEffect} from "react";
import {useUserStore} from "@/lib/store/userStore";

export default function AuthChecker() {
    const checkAuthStatus = useUserStore((state) => state.checkAuthStatus);
    const checkTokenValidity = useUserStore((state) => state.checkTokenValidity);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         checkTokenValidity();
    //     }, 5000);
    //
    //     return () => clearInterval(interval);
    // }, [checkTokenValidity]);

    return null;
}
