import React, { useEffect, useState } from "react"
import Link from "next/link"
import styled from "styled-components"
import Image from "next/image"

const HeroBannerContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(230.05deg, #f2faff 19.87%, #c4e8ff 84.85%);
  border-radius: 30px;
  overflow: hidden;
  padding: 50px 20px;
  margin: 20px 0;
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 30px 10px;
  }
`

const HeroContent = styled.div`
  z-index: 2;
  max-width: 600px;
  @media (max-width: 768px) {
    text-align: center;
    max-width: 100%;
  }
`

const HeroTitle = styled.h1`
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 20px;
  color: #003366;
  @media (max-width: 768px) {
    font-size: 32px;
  }
`

const HeroSubtitle = styled.div`
  font-size: 20px;
  font-weight: 500;
  line-height: 1.5;
  color: #0067b8;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    font-size: 16px;
  }
  p {
    font-size: 16px;
    color: #333;
  }
`

const CtaButton = styled.button`
  background-color: var(--color-main-blue);
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 12px;
  &:hover {
    background-color: var(--color-main-dark-blue);
    transform: scale(1.05);
  }
  &:focus {
    outline: none;
  }
  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 16px;
  }

  &.initial-hidden {
    opacity: 0;
    transition: none;
  }
`

const HeroImage = styled.div`
  position: relative;
  width: 50%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 2;
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    margin-top: 20px;
  }
`

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  background: url("/src/images/wavewarp.webp") no-repeat center center / cover;
  opacity: 0.2;
`

const HeroBanner = () => {
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    setTimeout(() => setInitialLoad(false), 0) // Ensure initialLoad is set to false after the initial render
  }, [])

  const imageSrc = "/src/images/hero_parts.png"

  return (
    <HeroBannerContainer>
      <BackgroundImage />
      <HeroContent>
        <HeroTitle>Build Your Ultimate PC</HeroTitle>
        <HeroSubtitle>
          <h2>We have what you need.</h2>
          <p>
            Discover the latest in high-performance hardware and accessories.
          </p>
        </HeroSubtitle>
        <Link href="/categories" passHref>
          <CtaButton className={initialLoad ? "initial-hidden" : ""}>
            Shop Now
          </CtaButton>
        </Link>
      </HeroContent>
      <HeroImage>
        <Image
          src={imageSrc}
          layout="intrinsic"
          width={600}
          height={400}
          objectFit="contain"
          alt="Hero Banner"
          priority={true}
          loading="eager"
        />
      </HeroImage>
    </HeroBannerContainer>
  )
}

export default HeroBanner
