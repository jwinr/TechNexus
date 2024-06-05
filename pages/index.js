import React, { useEffect, useRef, useState } from "react"
import Head from "next/head"
import About from "../components/hero/About"
import Brands from "../components/hero/Brands"
import BrandGrid from "../components/common/BrandGrid"
import HeroBanner from "../components/hero/HeroBanner"
import CategoryNavigation from "../components/categories/CategoryNavigation"
import TopDeals from "../components/shopping/TopDeals"
import styled, { keyframes } from "styled-components"

const slideFadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`

const HomeContainer = styled.div`
  display: grid;
  grid-template-areas:
    "hero-banner hero-banner hero-banner"
    "brand-title brand-title brand-title"
    "brand-swiper brand-swiper brand-swiper"
    "cat-title cat-title cat-title"
    "category-nav category-nav category-nav"
    "about about about"
    "top-deals-title top-deals-title top-deals-title"
    "top-deals top-deals top-deals";
  grid-template-columns: repeat(3, 1fr);
  grid-row-gap: 20px;
  padding: 30px;
`

const AnimatedCatTitle = styled.div`
  display: grid;
  text-align: center;
  grid-area: cat-title;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;

  &.in-view {
    opacity: 1;
    transform: translateY(0);
  }

  h2 {
    font-size: 34px;
    font-weight: 600;
  }
`

const BrandTitle = styled.div`
  padding: 0 2.5rem;
  text-align: center;
  grid-area: brand-title;

  h2 {
    font-size: 34px;
    font-weight: 600;
  }
`

const BrandSwiperContainer = styled.div`
  margin: 0 30px;
  grid-area: brand-swiper;
`

const TopDealsTitle = styled.div`
  padding: 0 2.5rem;
  display: flex;
  flex-direction: column;
  text-align: center;
  grid-area: top-deals-title;

  h2 {
    font-size: 34px;
    font-weight: 600;
  }
`

const Home = () => {
  const catTitleRef = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(entry.target) // Unobserve to prevent further triggers
        }
      },
      { threshold: 0.1 }
    )

    if (catTitleRef.current) {
      observer.observe(catTitleRef.current)
    }

    return () => {
      if (catTitleRef.current) {
        observer.unobserve(catTitleRef.current)
      }
    }
  }, [])

  return (
    <>
      <Head>
        <title>TechNexus</title>
        <meta
          name="description"
          content="Shop TechNexus for electronics, computers, laptops & more new tech. Free 2-day shipping on hundreds of items."
        />
        <meta property="og:title" content="TechNexus" key="title" />
      </Head>
      <HomeContainer>
        <HeroBanner />
        <AnimatedCatTitle ref={catTitleRef} className={inView ? "in-view" : ""}>
          <h2>Shop by Category</h2>
        </AnimatedCatTitle>
        <CategoryNavigation
          ref={catTitleRef}
          className={inView ? "in-view" : ""}
        />
        <About />
        <BrandSwiperContainer>
          <BrandGrid />
        </BrandSwiperContainer>
        <TopDealsTitle>
          <h2>Deals you'll love</h2>
        </TopDealsTitle>
        <TopDeals />
      </HomeContainer>
    </>
  )
}

export default Home
