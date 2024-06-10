import React from "react"
import Link from "next/link"
import styled from "styled-components"
import {
  RiFacebookFill,
  RiTwitterXFill,
  RiInstagramLine,
  RiYoutubeFill,
} from "react-icons/ri"
import LogoSymbol from "../../public/logo_dark.svg"

const FooterContainer = styled.footer`
  display: flex;
  background-color: var(--color-main-neutral);
  text-align: center;
  position: relative;
  padding: 25px 0px;
  justify-content: space-evenly;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 25px;

    &::after {
      /* Don't draw the vertical divider on mobile view */
      display: none;
    }
  }
`

const SlimFooter = styled.div`
  background-color: var(--color-main-dark-gray);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 25px 0px;

  @media (max-width: 768px) {
    gap: 15px;
  }
`

const FooterColumnContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly; /* Distribute the columns evenly */

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding-top: 25px; /* Match the padding of the FooterContainer */
    border-top: 1px solid rgba(243, 245, 248, 0.5);
  }
`

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%; /* Ensuring each column has equal width */

  @media (max-width: 768px) {
    width: 100%;
  }
`

const FooterTitle = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`

const FooterLink = styled.div`
  text-decoration: none;
  font-size: 14px;
  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 11px;
  }
`

const BottomLinksWrapper = styled.div`
  display: flex;
  padding-left: 24px;
  padding-right: 24px;

  @media (max-width: 768px) {
    margin-top: 10px;
  }
`

const FooterLinkBottom = styled.div`
  font-size: 14px;
  text-decoration: none;
  color: var(--color-main-white);
  margin-right: 16px;
  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    margin-right: 8px;
  }
`

const SocialMedia = styled.div`
  display: flex;
  font-size: 24px;
  gap: 5px;

  @media (max-width: 768px) {
    font-size: 20px;
    gap: 10px;
  }
`

const LogoBox = styled.div`
  display: flex;
  justify-content: center;

  svg {
    width: 140px;
    fill: white;
    margin-bottom: 25px;
  }

  @media (max-width: 768px) {
    svg {
      width: 100px;
      height: 100px;
    }
  }
`

const CopyrightText = styled.p`
  font-size: 14px;
  opacity: 0.6;
  margin-bottom: 15px;
`

const Footer = () => {
  return (
    <>
      <FooterContainer>
        <FooterColumnContainer>
          <FooterColumn>
            <FooterTitle>About Us</FooterTitle>
            <Link href="/about-us">
              <FooterLink>About TechNexus</FooterLink>
            </Link>
            <Link href="/accessibility">
              <FooterLink>Accessibility Commitment</FooterLink>
            </Link>
          </FooterColumn>
          <FooterColumn>
            <FooterTitle>Customer Service</FooterTitle>
            <Link href="/hc">
              <FooterLink>Help Center</FooterLink>
            </Link>
            <Link href="/return-policy">
              <FooterLink>Returns</FooterLink>
            </Link>
            <Link href="/shipping-policy">
              <FooterLink>Shipping</FooterLink>
            </Link>
            <Link href="/contact-us">
              <FooterLink>Contact Us</FooterLink>
            </Link>
            <Link href="/hc">
              <FooterLink>Order Status</FooterLink>
            </Link>
          </FooterColumn>
          <FooterColumn>
            <FooterTitle>Follow Us</FooterTitle>
            <SocialMedia>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <RiFacebookFill />
              </a>
              <a
                href="https://www.x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <RiTwitterXFill />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <RiInstagramLine />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <RiYoutubeFill />
              </a>
            </SocialMedia>
          </FooterColumn>
        </FooterColumnContainer>
      </FooterContainer>
      <SlimFooter>
        <LogoBox>
          <LogoSymbol />
        </LogoBox>
        <CopyrightText>© TechNexus, Inc. All Rights Reserved.</CopyrightText>
        <BottomLinksWrapper>
          <Link href="/terms-of-service">
            <FooterLinkBottom>Terms Of Service</FooterLinkBottom>
          </Link>
          <Link href="/privacy-policy">
            <FooterLinkBottom>Privacy Policy</FooterLinkBottom>
          </Link>
        </BottomLinksWrapper>
      </SlimFooter>
    </>
  )
}

export default Footer
