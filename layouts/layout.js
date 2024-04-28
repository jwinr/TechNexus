import toast, { Toaster } from "react-hot-toast"
import Footer from "../components/hero/Footer"
import ProductSearchBar from "../components/products/ProductSearchBar"
import CategoryDropdown from "../components/categories/CategoryDropdown"
import CartLink from "../components/shopping/CartLink"
import UserDropdown from "../components/user/UserDropdown"
import MainWrapper from "../components/common/MainWrapper"
import styled from "styled-components"
import { useRouter } from "next/router"

const NavbarContainer = styled.div`
  font-size: 16px;
  color: #000;
  display: flex;
  position: sticky;
  background-color: #266aca;
  box-shadow: 0 8px 21px -12px rgba(0, 0, 0, 0.2);
  top: 0;
  z-index: 300;

  @media (max-width: 768px) {
    display: block;
  }
`

const NavbarWrapper = styled.div`
  display: flex;
  background-color: #266aca !important;
  border-style: solid;
  border-width: 0 0 1px; /* Border only at the bottom */
  border-color: #00599c;
  box-shadow: 0 6px 21px -12px rgba(0, 0, 0, 0.4);
  padding: 7px 0px 7px 0px;
`

const Navbar = styled.div`
  display: grid;
  grid-template-columns: 3.5fr 2fr 13fr 9fr 1fr;
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

const MainContainer = styled.div`
  background-color: white;
  display: flex;
  justify-content: center;
  z-index: 100;
  position: relative;
`

const FooterContainer = styled.footer`
  background-color: #f2f2f2;
  display: flex;
  flex-direction: column;
`

const Logo = styled.a`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    margin: 3px;
    grid-area: nav-logo;
  }
`

export default function Layout({ children }) {
  const router = useRouter()

  // Check if the current route is /login
  const isLoginPage = router.pathname === "/login"

  // Render the Navbar only if the route is not /login
  const renderNavbar = !isLoginPage && (
    <NavbarContainer>
      <NavbarWrapper>
        <Navbar>
          <Logo href="/" aria-label="Home">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1400 235"
              version="1.1"
            >
              <defs>
                <filter id="Filter_0">
                  <feFlood
                    floodColor="rgb(255, 255, 255)"
                    floodOpacity="1"
                    result="floodOut"
                  />
                  <feComposite
                    operator="atop"
                    in="floodOut"
                    in2="SourceGraphic"
                    result="compOut"
                  />
                  <feBlend mode="normal" in="compOut" in2="SourceGraphic" />
                </filter>
              </defs>
              <g filter="url(#Filter_0)">
                <path
                  d="M80.456 1.856c-3.644 1.678-7.682 7.172-40.819 55.546C19.41 86.929 2.204 112.661 1.4 114.584c-1.221 2.923-1.415 10.648-1.18 47.04l.28 43.542 3.266 2.917c3.816 3.409 9.321 3.919 13.261 1.229 1.36-.928 14.173-10.294 28.473-20.813s28.138-20.581 30.75-22.36l4.75-3.235v-61.393c0-33.766.346-61.607.769-61.868.853-.528 8.002 2.484 48.231 20.32 15.125 6.706 28.175 12.27 29 12.365 1.307.15 1.5-4.165 1.5-33.551V5.054l-2.277-2.277c-2.273-2.274-2.32-2.277-38-2.53C87.181.013 84.196.133 80.456 1.856"
                  fill="#1f90ce"
                  fill-rule="evenodd"
                />
                <path
                  d="M228.5 24.687c-1.1.215-14.688 9.766-30.195 21.225s-30.243 22.129-32.748 23.711l-4.553 2.877-.002 61.691c-.001 34.899-.388 61.93-.891 62.24-.489.302-17.701-6.917-38.25-16.043-20.548-9.126-38.148-16.824-39.111-17.107-1.64-.482-1.75 1.455-1.75 30.953 0 19.765.398 32.609 1.07 34.536 2.083 5.977 3.819 6.23 42.581 6.226 32.105-.003 35.085-.149 37.849-1.847 1.96-1.204 15.585-20.254 39.312-54.967 19.972-29.219 37.072-54.6 38-56.403 1.507-2.927 1.688-7.9 1.688-46.378 0-45.894-.099-46.898-4.86-49.228-2.93-1.434-5.759-1.95-8.14-1.486M644 115.5V186h21v-79.193l22.25.456c15.251.312 23.503.89 26.232 1.835 5.489 1.902 12.05 8.46 13.408 13.402.684 2.488 1.101 15.243 1.104 33.75L728 186h21.185l-.428-32.75c-.406-31.078-.545-33.076-2.727-39.128-3.031-8.404-9.051-15.624-16.427-19.696-10.033-5.541-16.442-6.642-41.853-7.19L665 86.745V45h-21zm149.196-55.668c-6.572 2.351-10.744 6.177-13.813 12.668l-2.363 5-.01 54.25L777 186h22v-50.066c0-49.937.19-53.026 3.4-55.169 2.212-1.477 7.519-.769 9.404 1.256 1.036 1.111 10.112 20.123 20.17 42.25s19.559 42.952 21.113 46.28c5.864 12.559 14.695 17.912 29.413 17.828 10-.057 17.022-2.834 22.066-8.727 6.364-7.435 6.434-8.164 6.434-66.834V60h-23v51.345c0 48.472-.102 51.438-1.829 53-2.538 2.297-8.644 2.14-10.882-.279-.984-1.064-11.014-22.261-22.289-47.104-21.764-47.955-24.036-51.897-32.372-56.154-5.993-3.061-20.188-3.566-27.432-.976M301 71.5V83h37v103h23V83h37V60h-97zm134.5 16.547c-8.214 1.26-16.18 5.512-20.198 10.78-5.833 7.647-6.494 12.019-6.128 40.514l.326 25.308 3.01 5.883c1.866 3.645 4.64 7.124 7.295 9.149 7.796 5.947 10.701 6.319 49.377 6.319H504v-20h-33.05c-36.283 0-37.435-.17-40.433-5.967-.834-1.614-1.517-5.206-1.517-7.983V147l24.75-.006c27.517-.006 34.149-.731 42.048-4.596 9.828-4.808 14.41-15.969 12.41-30.225-1.72-12.253-8.673-20.425-19.86-23.343-5.16-1.346-45.302-1.94-52.848-.783m128-.092c-18.689 2.576-29.665 12.802-34.103 31.774-2.3 9.83-1.536 31.578 1.392 39.619 4.731 12.998 12.759 21.165 24.347 24.771 5.357 1.668 9.495 1.881 36.489 1.881h30.447l-.286-9.75-.286-9.75-29.5-.5c-22.352-.379-30.106-.832-32-1.872-8.473-4.651-11.415-11.64-11.42-27.128-.005-12.63 1.368-17.83 6.085-23.051 5.73-6.342 9.27-6.949 40.553-6.949h26.854l-.286-9.75-.286-9.75-26.5-.117c-14.575-.065-28.75.193-31.5.572m400.488.101c-14.296 2.107-22.236 8.946-25.591 22.041-1.245 4.86-1.489 10.787-1.225 29.838l.328 23.775 3.51 6.891c2.974 5.837 4.349 7.392 8.987 10.163 3.011 1.8 7.057 3.712 8.989 4.249 1.974.548 18.748.978 38.264.981L1032 186v-20h-33.132c-31.533 0-33.29-.098-36.412-2.027-3.727-2.303-5.456-6.304-5.456-12.622V147l24.75-.008c13.612-.004 27.613-.472 31.112-1.039 17.056-2.768 25.174-13.233 23.915-30.83-.511-7.133-3.488-15.11-7.076-18.96-3.598-3.859-11.277-7.163-18.979-8.163-8.644-1.123-38.981-1.086-46.734.056m90.14.672c.754.95 10.71 11.544 22.122 23.541s20.737 22.132 20.722 22.522c-.016.39-10.542 11.959-23.392 25.709l-23.364 25 12.518.281 12.517.281 9.593-10.281c5.276-5.655 13.207-13.99 17.625-18.523l8.031-8.242 16.852 18.492L1144.203 186h26.039l-6.795-7.25c-3.737-3.988-14.209-15.024-23.27-24.527l-16.476-17.276 2.4-2.625c1.319-1.444 11.511-12.322 22.649-24.174S1169 88.24 1169 87.8s-5.366-.8-11.924-.8h-11.925l-16.807 17.5c-9.244 9.625-17.102 17.5-17.461 17.5-.36 0-7.793-7.85-16.518-17.444L1078.5 87.113l-12.872-.057c-12.064-.052-12.787.053-11.5 1.672m129.075 34.022.297 35.75 2.88 6.234c3.323 7.195 10.414 14.391 16.934 17.186 8.47 3.631 14.414 4.295 34.686 3.874 17.333-.36 20.139-.657 25.252-2.672 11.944-4.708 19.995-14.282 22.639-26.921.678-3.24 1.109-17.714 1.109-37.25V87h-19.899l-.3 32.916-.301 32.916-3 4.245c-5.107 7.226-8.574 8.372-26.452 8.746-18.268.383-22.783-.558-28.07-5.845-5.523-5.523-5.978-8.79-5.978-42.921V87h-20.094zm149.851-34.582c-16.491 2.355-25.348 14.072-23.731 31.392 1.082 11.58 5.626 18.393 15.059 22.577 4.623 2.051 7.199 2.33 26.618 2.877 27.3.769 29 1.44 29 11.457 0 2.75-.691 5.161-1.911 6.668l-1.91 2.361-32.84.5-32.839.5-.286 9.75-.286 9.75h32.72c38.877 0 41.943-.495 49.434-7.987 5.557-5.556 7.918-11.829 7.918-21.032 0-13.556-5.126-21.949-15.959-26.134-4.836-1.868-8.357-2.217-27.688-2.744-19.797-.539-22.368-.803-24.23-2.49-2.661-2.41-3.629-7.55-2.224-11.806 2.045-6.198 2.465-6.275 35.851-6.611l30.25-.304V87l-28.25.123c-15.537.068-31.151.538-34.696 1.045m-896.639 20.253c-5.602 2.44-7.415 5.914-7.415 14.214V130h52.968l3.166-2.829c2.624-2.344 3.183-3.602 3.266-7.348.133-5.989-1.843-9.383-6.561-11.271-5.21-2.084-40.702-2.186-45.424-.131m528.62-.115c-5.472 1.885-8.035 6.619-8.035 14.842V130h53.2l3.4-3.4c2.515-2.515 3.4-4.272 3.398-6.75-.002-5.287-2.961-10.167-6.998-11.544-4.751-1.62-40.261-1.62-44.965 0"
                  fill="#313131"
                  fill-rule="evenodd"
                />
              </g>
            </svg>
          </Logo>
          <CategoryDropdown />
          <ProductSearchBar />
          <UserDropdown />
          <CartLink />
        </Navbar>
      </NavbarWrapper>
    </NavbarContainer>
  )

  return (
    <div id="th_react_root">
      {renderNavbar}
      <MainContainer>
        <MainWrapper>{children}</MainWrapper>
      </MainContainer>
      <FooterContainer>
        <Footer />
      </FooterContainer>
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
      />
    </div>
  )
}
