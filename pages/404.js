import styled from "styled-components"
import Head from "next/head"
import FullPageContainer from "../components/common/FullPageContainer"
import LogoSymbol from "../public/logo_n.svg"

const NotFoundWrapper = styled.div`
  width: 60%;
  margin: 0 auto;
  height: auto;
  padding: 150px 0 50px 0;
  text-align: center;
`

const LogoBox = styled.div`
  margin-top: 15px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  max-width: 100%;
  max-height: 100%;

  svg {
    width: auto;
    height: 100px;
  }
`

const Message = styled.p`
  font-size: 42px;
  font-weight: 800;
`

const Custom404 = () => {
  return (
    <>
      <Head>
        <title>TechNexus</title>
        <meta
          name="description"
          content="Page not found. The page you are looking for does not exist."
        />
      </Head>
      <FullPageContainer>
        <NotFoundWrapper>
          <LogoBox>
            <LogoSymbol />
          </LogoBox>
          <Message>We're sorry! This page is currently unavailable.</Message>
        </NotFoundWrapper>
      </FullPageContainer>
    </>
  )
}

export default Custom404
