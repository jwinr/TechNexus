import React, { useState, useEffect } from "react"
import Link from "next/link"
import Head from "next/head"
import FullPageContainer from "../components/common/FullPageContainer"
import styled from "styled-components"
import Breadcrumb from "../components/common/Breadcrumb"

const PageWrapper = styled.div`
  display: grid;
  grid-template-areas:
    "title title"
    "first second";
  grid-template-columns: 0.5fr 3fr 2fr;
  padding: 0 30px;
`

const SitemapTitle = styled.h1`
  font-size: 34px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  grid-area: title;
`

const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  grid-area: first;

  li {
    margin-bottom: 10px;
    a {
      color: #007bff;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`

const Sitemap = () => {
  const [categoriesData, setCategories] = useState([])

  useEffect(() => {
    // Fetch category names from the API route
    fetch("/api/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching category names:", error))
  }, [])

  return (
    <div>
      <Head>
        <title>TechNexus - Site Map</title>
        <meta name="description" content="test" />
        <meta
          property="og:title"
          content={`TechNexus - Site Map`}
          key="title"
        />
      </Head>
      <FullPageContainer>
        <Breadcrumb />
        <PageWrapper>
          <SitemapTitle>Sitemap</SitemapTitle>
          <CategoryList>
            {categoriesData.map((category, index) => (
              <li className="category-item">
                <Link href={`/categories/${category.slug}`}>
                  {category.name}
                </Link>
              </li>
            ))}
          </CategoryList>
        </PageWrapper>
      </FullPageContainer>
    </div>
  )
}

export default Sitemap
