import React, { createContext, useEffect, useState, useContext } from "react"

// Define a context to share the mobile view state
const MobileViewContext = createContext()

export const MobileViewProvider = ({ children }) => {
  const [isMobileView, setIsMobileView] = useState(false)

  useEffect(() => {
    const mobileBreakpoint = 768 // Adjust this as needed

    const handleWindowResize = () => {
      setIsMobileView(window.innerWidth <= mobileBreakpoint)
    }

    handleWindowResize()

    window.addEventListener("resize", handleWindowResize)

    return () => {
      window.removeEventListener("resize", handleWindowResize)
    }
  }, [])

  return (
    <MobileViewContext.Provider value={isMobileView}>
      {children}
    </MobileViewContext.Provider>
  )
}

export const useMobileView = () => useContext(MobileViewContext)
