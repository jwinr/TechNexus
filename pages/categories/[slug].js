import React, { useEffect, useState, lazy, Suspense } from "react"
import { useRouter } from "next/router"
import styled from "styled-components"
import Head from "next/head"
import Breadcrumb from "../../components/common/Breadcrumb"
import CategoryTitle from "../../components/categories/CategoryTitle"
import ListItem from "../../components/items/ListItem"
import LoaderDots from "../../components/common/LoaderDots"
import { useMobileView } from "../../utils/MobileViewDetector"
import ErrorBoundary from "../../components/common/ErrorBoundary"
import { useFilters } from "../../context/FilterContext"

// Lazy-loaded components
const ItemFilter = lazy(() => import("../../components/items/ItemFilter"))
const CategorizedItems = lazy(() =>
  import("../../components/items/CategorizedItemsContainer")
)
const Pagination = lazy(() => import("../../components/common/Pagination"))

const CategoryGridContainer = styled.div`
  display: grid;
  grid-template-areas:
    "title title title"
    "info info info"
    "promo promo promo"
    "sort sort sort"
    "items items items"
    "items items items"
    "pagination pagination pagination";
`

const TitleWrapper = styled.div`
  display: flex;
  padding: 0px 30px;
  grid-area: title;
`

export default function CategoryPage() {
  const router = useRouter()
  const { slug, page = 1 } = router.query
  const { filterState, setFilterState } = useFilters()
  const [categoryData, setCategoryData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(parseInt(page) || 1)
  const [showFilteredItems, setShowFilteredItems] = useState(false)
  const [isFilterActive, setIsFilterActive] = useState(false)
  const [filteredItems, setFilteredItems] = useState([])
  const productsPerPage = 16
  const isMobileView = useMobileView()

  // Fetch category data with pagination
  const fetchCategoryData = (page) => {
    setLoading(true)
    fetch(`/api/categories/${slug}?page=${page}&limit=${productsPerPage}`)
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error("Category not found")
        }
      })
      .then((data) => {
        setCategoryData(data)
        setFilteredItems(data.products)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching category data:", error)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (slug) {
      fetchCategoryData(currentPage)
    }
  }, [slug, currentPage])

  useEffect(() => {
    // Handle browser back and forward navigation
    const handleRouteChange = (url) => {
      const newPage =
        parseInt(
          new URL(url, window.location.origin).searchParams.get("page")
        ) || 1
      setCurrentPage(newPage)
    }

    router.events.on("routeChangeComplete", handleRouteChange)

    // Clean up the event listener
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [router.events])

  if (loading) {
    return <LoaderDots />
  }

  // Callback function to update filtered items
  const handleFilterChange = (filteredItems) => {
    console.log("Filter change, filtered items:", filteredItems)
    setShowFilteredItems(false) // Hide items to trigger the fade-out animation

    setTimeout(() => {
      if (filteredItems.length === 0) {
        // If there are no filtered items, reset the filters locally
        setFilteredItems(categoryData.products)
        setIsFilterActive(false)
      } else {
        // Update the filtered items locally
        setFilteredItems(filteredItems)
        setIsFilterActive(true)
      }

      setShowFilteredItems(true) // Show items to trigger the fade-in animation
    }, 300)
  }

  // Function to handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, page: newPage },
      },
      undefined,
      { shallow: true }
    )
  }

  // Calculate the total number of pages
  const totalPages = categoryData
    ? Math.ceil(categoryData.totalCount / productsPerPage)
    : 1

  return (
    <>
      <Head>
        <title>{`${categoryData.name} - TechNexus`}</title>
        <meta
          name="description"
          content={`Discover ${categoryData.name} on TechNexus`}
        />
        <meta name="keywords" content={`${categoryData.keywords}`} />
      </Head>
      <Breadcrumb title={categoryData.name} />
      <CategoryGridContainer>
        <TitleWrapper>
          <CategoryTitle title={categoryData.name} />
        </TitleWrapper>
        <Suspense fallback={<LoaderDots />}>
          <ErrorBoundary>
            <ItemFilter
              inventoryItems={categoryData.products}
              onFilterChange={handleFilterChange}
              attributes={categoryData.attributes}
            />
          </ErrorBoundary>
        </Suspense>
        <Suspense fallback={<LoaderDots />}>
          <ErrorBoundary>
            <CategorizedItems isVisible={true}>
              {(isFilterActive ? filteredItems : categoryData.products).map(
                (item) => (
                  <ListItem
                    key={item.product_id}
                    link={`/products/${item.slug}`}
                    title={item.name}
                    price={item.price}
                    brand={item.brand}
                    rating={item.rating}
                    image={item.images}
                    id={item.product_id}
                  />
                )
              )}
            </CategorizedItems>
          </ErrorBoundary>
        </Suspense>
        <Suspense fallback={<LoaderDots />}>
          <ErrorBoundary>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          </ErrorBoundary>
        </Suspense>
      </CategoryGridContainer>
    </>
  )
}
