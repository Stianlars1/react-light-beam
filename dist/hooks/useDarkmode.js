"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsDarkmode = void 0;
const react_1 = require("react");
const useIsDarkmode = () => {
    const [isDarkmode, setIsDarkmodeActive] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => {
            setIsDarkmodeActive(matchMedia.matches);
        };
        // Set the initial value
        setIsDarkmodeActive(matchMedia.matches);
        // Listen for changes
        matchMedia.addEventListener("change", handleChange);
        // Cleanup listener on unmount
        return () => {
            matchMedia.removeEventListener("change", handleChange);
        };
    }, []);
    return { isDarkmode };
};
exports.useIsDarkmode = useIsDarkmode;
