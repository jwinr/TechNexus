import { useState, useEffect } from "react"
import toast, { Toaster } from "react-hot-toast"
import Footer from "./Footer"
import Navbar from "./navbar/Navbar"
import Content from "../components/common/ContentWrapper"
import styled from "styled-components"

const SiteWrapper = styled.div`
  background-color: var(--sc-color-white);
  display: flex;
  justify-content: center;
  z-index: 100;
  position: relative;
  min-height: calc(-63px + 100vh);
`

export default function Layout({ children }) {
  const [openDropdown, setOpenDropdown] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggle = (dropdown) => {
    setOpenDropdown((prevState) => {
      const newState = prevState === dropdown ? null : dropdown
      return newState
    })
  }

  return (
    <>
      <Navbar openDropdown={openDropdown} handleToggle={handleToggle} />
      <SiteWrapper>
        <Content>{children}</Content>
      </SiteWrapper>
      <Footer />
      {mounted && (
        <Toaster
          toastOptions={{
            className: "",
            style: {
              width: "320px",
              height: "85px",
              background: "var(--sc-color-white)",
              padding: "10px 20px",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              borderRadius: "3px",
              boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
            },
            success: {
              style: {
                borderLeft: "5px solid #61d345",
              },
            },
            error: {
              style: {
                borderLeft: "5px solid #ff4b4b",
              },
            },
          }}
          aria-live="polite"
        />
      )}
    </>
  )
}
