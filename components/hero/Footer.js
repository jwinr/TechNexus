import React from "react"
import Link from "next/link"
import styled from "styled-components"
import { BiSolidBookHeart } from "react-icons/bi"
import {
  RiFacebookFill,
  RiTwitterXFill,
  RiInstagramLine,
  RiYoutubeFill,
} from "react-icons/ri"

const FooterContainer = styled.footer`
  display: grid;
  grid-template-columns: 1fr 3fr;
  background-color: #212121;
  color: white;
  text-align: center;
  position: relative;
  padding: 25px 0px;
  margin-bottom: -1px; /* Overlap the container to fix a 1px border visual render bug */
  border-top: 1px solid rgba(255, 255, 255, 0.5);

  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    margin: 10px;
    left: calc(25% - 10px);
    width: 1px;
    background-color: rgba(243, 245, 248, 0.5);
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 25px;

    &::after {
      /* Don't draw the vertical divider on mobile view */
      display: none;
    }
  }
`

const FooterColumnContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;

  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    padding-top: 25px; /* Match the padding of the FooterContainer */
    border-top: 1px solid rgba(243, 245, 248, 0.5);
  }
`

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    width: 45%;
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

const FooterQuestionTitle = styled.div`
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`

const Email = styled.p`
  font-size: 13px;
  font-weight: 500;
  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`

const FooterLink = styled.div`
  text-decoration: none;
  font-size: 12px;
  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 11px;
  }
`

const FooterQuestionLink = styled.div`
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
`

const BottomFlexContainer = styled.div`
  background-color: #212121;
  color: rgba(243, 245, 248, 0.5);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding: 0px 50px;
  height: 44px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px;
    font-size: 10px;
    height: auto;
  }
`

const BottomLinksWrapper = styled.div`
  display: flex;

  @media (max-width: 768px) {
    margin-top: 10px;
  }
`

const FooterLinkBottom = styled.div`
  text-decoration: none;
  color: #fff;
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

const HelpCenter = styled.div`
  display: flex;
  align-items: center;
  font-size: 24px;
  gap: 5px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 20px;
    gap: 10px;
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
        <FooterColumnContainer>
          <FooterColumn>
            <FooterTitle>Orders & Returns</FooterTitle>
            <Link href="/hc">
              <FooterLink>Order Status</FooterLink>
            </Link>
            <Link href="/shipping-policy">
              <FooterLink>Shipping Policy</FooterLink>
            </Link>
            <Link href="/hc">
              <FooterLink>Return Policy</FooterLink>
            </Link>
          </FooterColumn>
          <FooterColumn>
            <FooterTitle>Company</FooterTitle>
            <Link href="/about-us">
              <FooterLink>About Us</FooterLink>
            </Link>
            <Link href="/contact-us">
              <FooterLink>Contact Us</FooterLink>
            </Link>
            <Link href="/blog">
              <FooterLink>Blog</FooterLink>
            </Link>
          </FooterColumn>
          <FooterColumn>
            <FooterTitle>Follow Us</FooterTitle>
            <SocialMedia>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RiFacebookFill />
              </a>
              <a
                href="https://www.x.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RiTwitterXFill />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RiInstagramLine />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RiYoutubeFill />
              </a>
            </SocialMedia>
          </FooterColumn>
        </FooterColumnContainer>
      </FooterContainer>

      <BottomFlexContainer>
        <div>© TechNexus, Inc. All Rights Reserved.</div>
        <BottomLinksWrapper>
          <Link href="/privacy-policy">
            <FooterLinkBottom>Privacy Policy</FooterLinkBottom>
          </Link>
          <Link href="/terms-conditions">
            <FooterLinkBottom>Terms and Conditions</FooterLinkBottom>
          </Link>
        </BottomLinksWrapper>
      </BottomFlexContainer>
    </div>
  )
}

export default Footer
