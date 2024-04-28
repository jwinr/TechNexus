import React from "react"
import Link from "next/link"
import styled from "styled-components"
import {
  BiLogoFacebook,
  BiLogoTwitter,
  BiLogoInstagram,
  BiLogoYoutube,
  BiSolidBookHeart,
} from "react-icons/bi"

const FooterContainer = styled.footer`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background-color: #f0f0f0;
  text-align: center;
  position: relative;
  padding: 25px 0px;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    margin: 10px;
    left: calc(25% - 10px);
    width: 1px;
    background-color: #ccc;
  }
`

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const FooterTitle = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
`

const FooterQuestionTitle = styled.div`
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 10px;
`

const Email = styled.p`
  font-size: 13px;
  font-weight: 500;
  &:hover {
    text-decoration: underline;
  }
`

const FooterLink = styled.div`
  text-decoration: none;
  font-size: 12px;
  color: #333;
  &:hover {
    text-decoration: underline;
  }
`

const FooterQuestionLink = styled.div`
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  &:hover {
    color: #004066;
  }
`

const BottomFlexContainer = styled.div`
  background-color: #004066;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding: 0px 50px;
  height: 44px;
`

const BottomLinksWrapper = styled.div`
  display: flex;
`

const FooterLinkBottom = styled.div`
  text-decoration: none;
  color: #fff;
  margin-right: 16px;
  &:hover {
    text-decoration: underline;
  }
`

const SocialMedia = styled.div`
  display: flex;
  font-size: 24px;
  gap: 5px;
`

const HelpCenter = styled.div`
  display: flex;
  align-items: center;
  font-size: 24px;
  gap: 5px;
  margin-bottom: 10px;

  &:hover {
    color: #004066;
  }
`

const Footer = () => {
  return (
    <div>
      <FooterContainer>
        <FooterColumn>
          <FooterQuestionTitle>Have a question?</FooterQuestionTitle>
          <Link href="/hc" passHref>
            <HelpCenter>
              <BiSolidBookHeart />
              <FooterQuestionLink>Visit our Help Center</FooterQuestionLink>
            </HelpCenter>
          </Link>
          <Link href="mailto:help@jwtechnexus.com">
            <Email>help@jwtechnexus.com</Email>
          </Link>
        </FooterColumn>
        <FooterColumn>
          <FooterTitle>Orders & Returns</FooterTitle>
          <Link href="/hc">
            <FooterLink>Order Status</FooterLink>
          </Link>
          <Link href="/hc">
            <FooterLink>Shipping Policy</FooterLink>
          </Link>
          <Link href="/hc">
            <FooterLink>Return Policy</FooterLink>
          </Link>
        </FooterColumn>
        <FooterColumn>
          <FooterTitle>Company</FooterTitle>
          <Link href="/hc">
            <FooterLink>About Us</FooterLink>
          </Link>
          <Link href="/hc">
            <FooterLink>Contact Us</FooterLink>
          </Link>
          <Link href="/hc">
            <FooterLink>Blog</FooterLink>
          </Link>
        </FooterColumn>
        <FooterColumn>
          <FooterTitle>Follow Us</FooterTitle>
          <SocialMedia>
            <BiLogoFacebook />
            <BiLogoTwitter />
            <BiLogoInstagram />
            <BiLogoYoutube />
          </SocialMedia>
        </FooterColumn>
      </FooterContainer>

      <BottomFlexContainer>
        <div>© TechNexus, Inc. All Rights Reserved.</div>
        <BottomLinksWrapper>
          <Link href="/privacy-policy">
            <FooterLinkBottom>Privacy Policy</FooterLinkBottom>
          </Link>
          <Link href="/terms-and-conditions">
            <FooterLinkBottom>Terms and Conditions</FooterLinkBottom>
          </Link>
          <Link href="/sitemap">
            <FooterLinkBottom>Site Map</FooterLinkBottom>
          </Link>
          <Link href="/do-not-sell">
            <FooterLinkBottom href="/do-not-sell">
              Do Not Sell Or Share My Personal Information
            </FooterLinkBottom>
          </Link>
        </BottomLinksWrapper>
      </BottomFlexContainer>
    </div>
  )
}

export default Footer
