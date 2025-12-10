import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        // Immediate scroll to top
        document.documentElement.scrollTo(0, 0);
        document.body.scrollTo(0, 0);

        // Backup for some browsers/situations
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        });
    }, [pathname]);

    return null;
}
