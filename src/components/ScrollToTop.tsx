import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const EXCLUDED_PATHS = ["/companion"];

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!EXCLUDED_PATHS.includes(pathname)) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [pathname]);

  return null;
}
