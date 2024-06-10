import styled from "styled-components"
import Head from "next/head"
import LogoSymbol from "../public/logo_n.svg"
import { useRouter } from "next/router"

const NotFoundWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  height: 100%;
  margin: 0 auto;
  justify-content: center;
  text-align: center;

  @media (max-width: 768px) {
    width: auto;
    padding: 50px;
  }
`

const LogoBox = styled.div`
  display: flex;
  justify-content: center;

  svg {
    width: 140px;
    height: 140px;
  }

  @media (max-width: 768px) {
    svg {
      width: 100px;
      height: 100px;
    }
  }
`

const Message = styled.p`
  font-size: 42px;
  font-weight: 800;

  @media (max-width: 768px) {
    align-self: center;
    font-size: 36px;
  }
`

const HomeButton = styled.button`
  align-items: center;
  justify-content: center;
  transition: all 0.1s ease-in 0s;
  border-radius: 6px;
  color: var(--color-main-white);
  border: medium;
  font-weight: bold;
  min-height: 44px;
  padding: 0px 16px;
  width: 100%;
  text-align: center;
  background-color: var(--color-main-blue);
  transition: background-color 0.2s;
  margin-top: 25px;

  &:hover {
    background-color: var(--color-main-dark-blue);
  }

  &:active {
    background-color: var(--color-main-dark-blue);
  }

  &:focus-visible {
    background-color: var(--color-main-dark-blue);
  }

  @media (min-width: 768px) {
    width: 50%;
    align-self: center;
  }
`

const Custom404 = () => {
  const router = useRouter()

  const handleHomeClick = () => {
    router.push("/")
  }
  return (
    <>
      <Head>
        <title>TechNexus - Page Not Found</title>
        <meta
          name="description"
          content="Page not found. The page you are looking for does not exist."
        />
      </Head>
      <NotFoundWrapper>
        <LogoBox>
          <a href="/" aria-label="Home">
            <LogoSymbol alt="TechNexus Logo" />
          </a>
        </LogoBox>
        <Message>
          Sorry, we couldn't find the page you were looking for.
        </Message>
        <HomeButton onClick={handleHomeClick}>Return to Homepage</HomeButton>
      </NotFoundWrapper>
    </>
  )
}

export default Custom404
