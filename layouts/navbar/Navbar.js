import { useState } from "react"
import { useRouter } from "next/router"
import styled from "styled-components"
import BannerLogo from "../../public/images/logo.svg"
import CategoryDropdown from "../navbar/CategoryDropdown"
import SearchBar from "./SearchBar"
import CartLink from "../../components/shopping/CartLink"
import UserDropdown from "../navbar/UserDropdown"

const NavbarContainer = styled.div`
  font-size: 16px;
  color: #000;
  display: flex;
  position: sticky;
  background-color: var(--sc-color-white);
  box-shadow: 0 8px 21px -12px rgba(0, 0, 0, 0.2);
  top: 0;
  z-index: 300;

  @media (max-width: 768px) {
    display: block;
  }
`

const NavbarWrapper = styled.div`
  display: flex;
  background-color: var(--sc-color-white) !important;
  border-bottom: 1px solid #e4e4e4;
  padding: 7px 0px 7px 0px;
`

const NavbarGrid = styled.div`
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

const Logo = styled.a`
  display: flex;
  align-items: center;
  border: 1px transparent;
  border-radius: 10px;

  @media (max-width: 768px) {
    margin: 3px;
    grid-area: nav-logo;
  }
`

const Navbar = ({ openDropdown, handleToggle }) => {
  const router = useRouter()

  // Check if the current route is /login, /signup, /forgot-password or /404
  const isLoginPage = router.pathname === "/login"
  const isSignupPage = router.pathname === "/signup"
  const isForgotPassPage = router.pathname === "/forgot-password"
  const is404Page = router.pathname === "/404"

  // Render the Navbar only if the route is not /login, /signup, /forgot-password or /404
  // This also extends to any invalid path routes, i.e. /<any-nonexistent-path>
  if (isLoginPage || isSignupPage || isForgotPassPage || is404Page) {
    return null
  }

  return (
    <NavbarContainer>
      <NavbarWrapper>
        <NavbarGrid>
          <Logo href="/" aria-label="Home">
            <BannerLogo alt="TechNexus Logo" />
          </Logo>
          <CategoryDropdown
            isOpen={openDropdown === "category"}
            onToggle={() => handleToggle("category")}
          />
          <SearchBar />
          <UserDropdown
            isOpen={openDropdown === "user"}
            onToggle={() => handleToggle("user")}
            aria-label="User Menu"
          />
          <CartLink aria-label="Shopping Cart" />
        </NavbarGrid>
      </NavbarWrapper>
    </NavbarContainer>
  )
}

export default Navbar
