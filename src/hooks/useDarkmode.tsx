"use client";
import {useEffect, useState} from "react";

export const useIsDarkmode = () => {
    const [isDarkmode, setIsDarkmodeActive] = useState(false);

    useEffect(() => {
        const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = () => {
            console.log("Darkmode match?", matchMedia.matches)
            
            setIsDarkmodeActive(matchMedia.matches);
        };

        // Set the initial value
        setIsDarkmodeActive(matchMedia.matches);

        // Listen for changes
        matchMedia.addEventListener("change", handleChange);
        handleChange()

        // Cleanup listener on unmount
        return () => {
            matchMedia.removeEventListener("change", handleChange);
        };
    }, []);

    return {isDarkmode};
};
