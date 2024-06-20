import React, { useEffect, useRef, useState } from "react"
import Head from "next/head"
import About from "../components/hero/About"
import BrandGrid from "../components/common/BrandGrid"
import HeroBanner from "../components/hero/HeroBanner"
import FeaturedCategories from "../components/common/FeaturedCategories"
import TopDeals from "../components/shopping/TopDeals"
import NewsletterSignup from "../components/common/NewsletterSignup"
import styled from "styled-components"
import SecondaryHeroBanner from "../components/hero/SecondaryHeroBanner"

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 0 30px;
  max-width: 1200px;
  margin: 0 auto;
`

const Section = styled.section`
  padding: 20px 0;
`

const Title = styled.h2`
  text-align: center;
  font-size: 34px;
  font-weight: 600;
  margin-bottom: 20px;
`

const AnimatedCatTitle = styled(Title)`
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;

  &.in-view {
    opacity: 1;
    transform: translateY(0);
  }

  &.initial-hidden {
    opacity: 0;
    transform: translateY(20px);
    transition: none;
  }
`

const Home = () => {
  const catTitleRef = useRef(null)
  const catNavRef = useRef(null)
  const secHeroRef = useRef(null)
  const [inView, setInView] = useState(false)
  const [catNavInView, setCatNavInView] = useState(false)
  const [secHeroInView, setSecHeroInView] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    setTimeout(() => setInitialLoad(false), 0) // Ensure initialLoad is set to false after the initial render
  }, [])

  useEffect(() => {
    const titleObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          titleObserver.unobserve(entry.target) // Unobserve to prevent further triggers
        }
      },
      { threshold: 0.1 }
    )

    const navObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCatNavInView(true)
          navObserver.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    const secObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSecHeroInView(true)
          secObserver.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    if (catTitleRef.current) {
      titleObserver.observe(catTitleRef.current)
    }

    if (catNavRef.current) {
      navObserver.observe(catNavRef.current)
    }

    if (secHeroRef.current) {
      secObserver.observe(secHeroRef.current)
    }

    return () => {
      if (catTitleRef.current) {
        titleObserver.unobserve(catTitleRef.current)
      }
      if (catNavRef.current) {
        navObserver.unobserve(catNavRef.current)
      }
      if (secHeroRef.current) {
        secObserver.unobserve(secHeroRef.current)
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
        <Section>
          <HeroBanner />
        </Section>
        <Section>
          <BrandGrid />
        </Section>
        <Section>
          <SecondaryHeroBanner
            ref={secHeroRef}
            className={`${secHeroInView ? "in-view" : ""}`}
          />
        </Section>
        <Section>
          <About />
        </Section>
        <Section>
          <Title>Deals You'll Love</Title>
          <TopDeals />
        </Section>
        <Section>
          <AnimatedCatTitle
            ref={catTitleRef}
            className={`${initialLoad ? "initial-hidden" : ""} ${
              inView ? "in-view" : ""
            }`}
          >
            Featured categories
          </AnimatedCatTitle>
          <FeaturedCategories
            ref={catNavRef}
            className={`${initialLoad ? "initial-hidden" : ""} ${
              catNavInView ? "in-view" : ""
            }`}
          />
        </Section>
        <Section>
          <NewsletterSignup />
        </Section>
      </HomeContainer>
    </>
  )
}

export default Home
