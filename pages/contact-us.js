import Head from "next/head"
import styled from "styled-components"
import FullPageContainer from "../components/common/FullPageContainer"
import Link from "next/link"

const ContactPageWrapper = styled.div`
  display: flex;
  padding: 30px 30px 30px 30px;
  flex-direction: column;
  gap: 15px;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`

const HeaderText = styled.h1`
  font-weight: 800;
  font-size: 29px;
`

const SubheaderText = styled.h2`
  font-weight: 800;
  font-size: 16px;
`

const TermsService = () => {
  return (
    <>
      <Head>
        <title>Contact Us</title>
        <meta
          name="description"
          content="Get in touch with TechNexus. Questions, feedback, press or business proposals."
        />
        <meta property="og:title" content="Contact Us" key="title" />
      </Head>
      <FullPageContainer>
        <ContactPageWrapper>
          <HeaderText>Contact Us</HeaderText>
          <p>OVERVIEW</p>
          <p>Placeholder..</p>
        </ContactPageWrapper>
      </FullPageContainer>
    </>
  )
}

export default TermsService
