import { useState, useEffect } from "react"
import toast, { Toaster } from "react-hot-toast"
import Footer from "../components/hero/Footer"
import ProductSearchBar from "../components/products/ProductSearchBar"
import CategoryDropdown from "../components/categories/CategoryDropdown"
import CartLink from "../components/shopping/CartLink"
import UserDropdown from "../components/user/UserDropdown"
import Content from "../components/common/ContentWrapper"
import styled from "styled-components"
import { useRouter } from "next/router"
import BannerLogo from "../public/banner-logo.svg"

const NavbarContainer = styled.div`
  font-size: 16px;
  color: #000;
  display: flex;
  position: sticky;
  background-color: white;
  box-shadow: 0 8px 21px -12px rgba(0, 0, 0, 0.2);
  top: 0;
  z-index: 300;

  @media (max-width: 768px) {
    display: block;
  }
`

const NavbarWrapper = styled.div`
  display: flex;
  background-color: white !important;
  border-bottom: 1px solid #e4e4e4;
  padding: 7px 0px 7px 0px;
`

const Navbar = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr 13fr 9fr 1fr;
  grid-template-rows: 1fr;
  padding: 5px 20px;
  grid-gap: 20px;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-rows: auto; /* Allow rows to expand based on content */
    grid-template-columns: 0.75fr 0.75fr 0.5fr 0.25fr;
    grid-template-areas:
      "nav-cat nav-logo nav-user nav-cart"
      "nav-search nav-search nav-search nav-search";
    grid-gap: 5px; /* Reduce the gap between items */
    padding: 10px 15px; /* Adjust padding for smaller screens */
  }
`

const SiteWrapper = styled.div`
  background-color: var(--color-main-white);
  display: flex;
  justify-content: center;
  z-index: 100;
  position: relative;
  min-height: calc(-63px + 100vh);
`

const Logo = styled.a`
  display: flex;
  align-items: center;
  border: 1px dashed transparent;
  border-radius: 10px;

  &:focus-visible {
    outline: var(--focus-outline);
    outline-offset: var(--focus-outline-offset);
  }

  @media (max-width: 768px) {
    margin: 3px;
    grid-area: nav-logo;
  }
`

export default function Layout({ children }) {
  const router = useRouter()

  const [openDropdown, setOpenDropdown] = useState(null)

  // Check if the current route is /login or /404
  const isLoginPage = router.pathname === "/login"
  const is404Page = router.pathname === "/404"

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

  // Render the Navbar only if the route is not /login or /404
  // This also extends to any invalid path routes, i.e. /<any-nonexistent-path>
  const renderNavbar = !isLoginPage && !is404Page && (
    <NavbarContainer>
      <NavbarWrapper>
        <Navbar>
          <Logo href="/" aria-label="Home">
            <BannerLogo alt="TechNexus Logo" />
          </Logo>
          <CategoryDropdown
            isOpen={openDropdown === "category"}
            onToggle={() => handleToggle("category")}
          />
          <ProductSearchBar />
          <UserDropdown
            isOpen={openDropdown === "user"}
            onToggle={() => handleToggle("user")}
            aria-label="User Menu"
          />
          <CartLink aria-label="Shopping Cart" />
        </Navbar>
      </NavbarWrapper>
    </NavbarContainer>
  )

  return (
    <>
      {renderNavbar}
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
              background: "#fff",
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
