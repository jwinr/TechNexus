import React, { createContext, useEffect, useState, useContext } from "react"

const MobileViewContext = createContext()

export const MobileViewProvider = ({ children }) => {
  const [isMobileView, setIsMobileView] = useState(false)

  useEffect(() => {
    const mobileBreakpoint = 768

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
