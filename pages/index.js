import Head from "next/head"
import About from "../components/hero/About"
import Brands from "../components/hero/Brands"
import { slugify } from "../utils/helpers"
import BrandSwiper from "../components/common/BrandSwiper"
import HeroBanner from "../components/hero/HeroBanner"
import CategoryNavigation from "../components/categories/CategoryNavigation"
import TopDeals from "../components/shopping/TopDeals"
import styled, { keyframes } from "styled-components"
import LargeContainerFixed from "../components/common/LargeContainerFixed"
import MainWrapper from "../components/common/MainWrapper"

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

const CatTitle = styled.div`
  display: grid;
  text-align: center;
  grid-area: cat-title;

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
  return (
    <>
      <Head>
        <title>TechNexus</title>
        <meta
          name="description"
          content="TechNexus is a modern web ecommerce application powered by React, Next.js, AWS, and PostgreSQL."
        />
        <meta property="og:title" content="TechNexus" key="title" />
      </Head>
      <LargeContainerFixed>
        <HomeContainer>
          <HeroBanner />
          <CatTitle>
            <h2>Shop by Category</h2>
          </CatTitle>
          <CategoryNavigation />
          <About />
          <BrandTitle>
            <h2>Featured Brands</h2>
          </BrandTitle>
          <BrandSwiperContainer>
            <BrandSwiper />
          </BrandSwiperContainer>
          <TopDealsTitle>
            <h2>Deals you'll love</h2>
          </TopDealsTitle>
          <TopDeals />
        </HomeContainer>
      </LargeContainerFixed>
    </>
  )
}

export default Home
