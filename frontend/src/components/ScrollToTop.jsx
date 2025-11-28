import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll ke posisi (0, 0) yaitu paling atas kiri
    window.scrollTo(0, 0);
  }, [pathname]); // Dijalankan setiap kali 'pathname' (URL) berubah

  return null; // Komponen ini tidak merender apa-apa
};

export default ScrollToTop;