import * as React from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkIsMobile = () => {
      // Check for touch capability (includes tablets and iPads)
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Detect iPad specifically (iPad reports as desktop in user agent but has touch)
      const isIPad = /iPad|Macintosh/.test(navigator.userAgent) && hasTouchScreen;
      
      // Consider it mobile/tablet if it has touch OR is small screen
      const isSmallScreen = window.innerWidth < 1024;
      
      return hasTouchScreen || isIPad || isSmallScreen;
    };
    
    setIsMobile(checkIsMobile());
    
    // Listen for window resize
    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [])

  return !!isMobile
}
