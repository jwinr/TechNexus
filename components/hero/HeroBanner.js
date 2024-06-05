import React from "react"
import Link from "next/link"
import styled, { keyframes } from "styled-components"
import Image from "next/image"

const HeroBannerContainer = styled.div`
  position: relative;
  display: grid;
  background: linear-gradient(230.05deg, #f2faff 19.87%, #c4e8ff 84.85%);
  grid-area: hero-banner;
  border-radius: 30px;
  overflow: hidden; // Prevent the wave warp from extending past the container

  @media (max-width: 768px) {
    grid-template-areas: "left" "right";
    grid-template-columns: 1fr;
  }
`

const HeroContent = styled.div`
  display: grid;
  grid-template-areas:
    "top top"
    "middle-l middle-r";
  gap: 25px;
  padding: 20px;
  z-index: 200;
`

const HeroTitle = styled.div`
  font-size: 68px;
  font-weight: 500;
  line-height: 65px;
  text-align: left;
  grid-area: top;
  top: 50px;

  @media (max-width: 768px) {
    font-size: 40px;
    line-height: 1.2;
    word-break: break-word;
  }
`

const HeroSubtitle = styled.div`
  font-size: 26px;
  font-weight: 500;
  line-height: 30px !important;
  text-align: left;
  word-wrap: anywhere;
  max-width: 55%;
  grid-area: middle-l;

  h2 {
    background: linear-gradient(180deg, #0067b8 0, #3999ed 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    padding-bottom: 10px;
  }

  p {
    font-size: 15px;
    line-height: 20px;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    line-height: 16px;
    word-break: break-word;
  }
`

const HeroImage = styled.div`
  grid-area: middle-r;
`

const WaveWarp = styled.div`
  z-index: 100;
  position: absolute;
  top: 275px;

  -webkit-mask-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 1),
    rgba(0, 0, 0, 0)
  );
`

const CtaBtnContainer = styled.div`
  grid-area: middle-l;
  display: grid;
  margin-top: 125px; // Force the cta button down for now
  width: max-content; // and make it so you can't click outside of it
  height: max-content;
`

const CtaButton = styled.button`
  background-color: #004066;
  color: var(--color-main-white);
  border: none;
  padding: 8px 13px;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 12px 0px;

  &:hover {
    background-color: #002134;
  }

  &:focus {
    outline: none;
  }
`

const HeroBanner = () => {
  const imageSrc = "/src/images/hero_parts.png"

  const waveSrc = "/src/images/wavewarp.webp"

  return (
    <>
      <HeroBannerContainer>
        <HeroContent>
          <HeroTitle>
            <h1>Your dream build is here.</h1>
          </HeroTitle>
          <HeroSubtitle>
            <h2>Unleash innovation, elevate performance</h2>
            <p>Explore our limitless choices on cutting-edge hardware.</p>
          </HeroSubtitle>
          <CtaBtnContainer>
            <Link href="/categories">
              <CtaButton>Shop Now</CtaButton>
            </Link>
          </CtaBtnContainer>
          <HeroImage>
            <Image
              src={imageSrc}
              width={1053}
              height={681}
              alt="Hero Banner"
              priority={true}
              loading="eager"
            />
          </HeroImage>
        </HeroContent>
        <WaveWarp>
          <Image
            src={waveSrc}
            width={1053}
            height={681}
            priority={true}
            alt="Hero Banner"
          />
        </WaveWarp>
      </HeroBannerContainer>
    </>
  )
}

export default HeroBanner
