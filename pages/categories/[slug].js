// pages/categories/[slug].js
import React, { useEffect, useState, lazy, Suspense, useContext } from "react"
import { useRouter } from "next/router"
import styled from "styled-components"
import Head from "next/head"
import Breadcrumb from "../../components/common/Breadcrumb"
import CategoryTitle from "../../components/categories/CategoryTitle"
import ListItem from "../../components/items/ListItem"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons"
import toast from "react-hot-toast"
import { useMobileView } from "../../utils/MobileViewDetector"
import ErrorBoundary from "../../components/common/ErrorBoundary"
import { SiteContext } from "../../context/mainContext"

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

const CategorySortPanel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-area: sort;
  padding: 0 30px;
`

const SortText = styled.p`
  font-size: 13px;
`

const TotalItems = styled.p`
  font-size: 13px;
  font-weight: 500;
`

const SortDropdown = styled.select`
  background-color: var(--color-main-white);
  border: 1px solid var(--color-border-gray);
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
`

const TitleWrapper = styled.div`
  display: flex;
  padding: 0px 30px;
  grid-area: title;
`

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(-63px + 100vh);
`

export default function CategoryPage() {
  const router = useRouter()
  const { slug } = router.query
  const [categoryData, setCategoryData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 16
  const [showFilteredItems, setShowFilteredItems] = useState(false)
  const [isFilterActive, setIsFilterActive] = useState(false)
  const [filteredItems, setFilteredItems] = useState(categoryData)
  const [sortBy, setSortBy] = useState("Most Popular")
  const isMobileView = useMobileView()
  const { addToCart } = useContext(SiteContext)

  // Reset isFilterActive when the category changes (new page is loaded)
  useEffect(() => {
    if (categoryData?.name) {
      setIsFilterActive(false) // Reset to false when category changes
      setSortBy("Most Popular")
    }
  }, [categoryData?.name]) // Listen for changes to the category title

  useEffect(() => {
    if (slug) {
      setLoading(true)
      fetch(`/api/categories/${slug}`)
        .then((response) => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error("Category not found")
          }
        })
        .then((data) => setCategoryData(data))
        .catch((error) => console.error("Error fetching category data:", error))
        .finally(() => setLoading(false))
    }
  }, [slug])

  if (loading) {
    return (
      <SpinnerContainer>
        <LoadingSpinner />
      </SpinnerContainer>
    )
  }

  // Callback function to update filtered items
  const handleFilterChange = (filteredItems) => {
    //console.log("Filter change, filtered items:", filteredItems)
    setShowFilteredItems(false) // Hide items to trigger the fade-out animation

    setTimeout(() => {
      if (filteredItems.length === 0) {
        // If there are no filtered items, reset the filters
        setFilteredItems(categoryData.products)
        setIsFilterActive(false)

        // Show a notification about the filter reset
        toast(
          "We couldn't find any products with those filters. Your filters have been reset.",
          {
            duration: 4000,
            style: { borderLeft: "5px solid #fdc220" },
            className: "",
            icon: (
              <FontAwesomeIcon
                icon={faExclamationCircle}
                style={{
                  color: "#fdc220",
                  animation:
                    "toastZoom 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)forwards",
                  animationDelay: "100ms",
                }}
              />
            ),
            position: isMobileView ? "bottom-center" : "bottom-right", // Use 'bottom-center' for mobile view
          }
        )
      } else {
        // Update the filtered items
        setFilteredItems(filteredItems)
        setIsFilterActive(true)
        setCurrentPage(1) // Reset to the first page when filters change
      }

      setShowFilteredItems(true) // Show items to trigger the fade-in animation
    }, 300)
  }

  // Function to handle sorting
  const handleSortChange = (selectedSortBy) => {
    // Update the sorting criteria
    setSortBy(selectedSortBy)

    // Set isFilterActive to true when sorting options are selected
    setIsFilterActive(true)

    // Sort the items based on the selected criteria
    let sortedItems = [...filteredItems]

    if (selectedSortBy === "Most Popular") {
      // Need to implement sorting logic for "Most Popular" (e.g., based on views, ratings)
      // sortedItems = ...
    } else if (selectedSortBy === "Highest Rating") {
      // Sorting logic for "Highest Rating"
      // sortedItems = ...
    } else if (selectedSortBy === "Highest Price") {
      sortedItems.sort((a, b) => b.price - a.price)
    } else if (selectedSortBy === "Lowest Price") {
      sortedItems.sort((a, b) => a.price - b.price)
    }

    // Update the filtered items based on the sorted items
    setFilteredItems(sortedItems)
  }

  // Calculate the total item count based on the items to be displayed
  const totalItemCount = isFilterActive
    ? filteredItems.length
    : categoryData.products.length

  // Calculate the range of products to display for the current page
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = isFilterActive
    ? filteredItems.slice(indexOfFirstProduct, indexOfLastProduct)
    : categoryData.products.slice(indexOfFirstProduct, indexOfLastProduct)

  // Function to handle pagination
  const handlePageChange = (newPage) => {
    if (currentPage !== newPage) {
      setCurrentPage(newPage)
    }
  }

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalItemCount / productsPerPage)

  const addToCartFromList = (product) => {
    product["quantity"] = 1 // Since users cannot select quantities directly from the list, start with one unit
    addToCart(product)
  }

  return (
    <>
      <Head>
        <title>{`${categoryData.name} - TechNexus`}</title>
        <meta
          name="description"
          content={`Discover ${categoryData.name} on TechNexus`}
        />
        <meta name="keywords" content={`${categoryData.keywords}`}></meta>
      </Head>
      <Breadcrumb title={categoryData.name} />
      <CategoryGridContainer>
        <TitleWrapper>
          <CategoryTitle title={categoryData.name} />
        </TitleWrapper>
        <CategorySortPanel>
          <TotalItems>
            {totalItemCount === 0
              ? "No results found"
              : `Showing ${indexOfFirstProduct + 1} - ${Math.min(
                  indexOfLastProduct,
                  totalItemCount
                )} of ${totalItemCount} ${
                  totalItemCount === 1 ? "result" : "results"
                }`}
          </TotalItems>
          <SortText>
            <label htmlFor="sortBy">Sort By: </label>
            <SortDropdown
              id="sortBy"
              onChange={(e) => handleSortChange(e.target.value)}
              value={sortBy}
            >
              <option value="Most Popular">Most Popular</option>
              <option value="Highest Rating">Highest Rating</option>
              <option value="Highest Price">Highest Price</option>
              <option value="Lowest Price">Lowest Price</option>
            </SortDropdown>
          </SortText>
        </CategorySortPanel>
        <Suspense fallback={<LoadingSpinner />}>
          <ErrorBoundary>
            <ItemFilter
              inventoryItems={categoryData.products}
              onFilterChange={handleFilterChange}
              attributes={categoryData.attributes}
            />
          </ErrorBoundary>
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <ErrorBoundary>
            <CategorizedItems isVisible={showFilteredItems}>
              {isFilterActive
                ? currentProducts.map((item) => (
                    <ListItem
                      key={item.product_id}
                      link={`/products/${item.slug}`}
                      title={item.name}
                      price={item.price}
                      brand={item.brand}
                      rating={item.rating}
                      image={item.images}
                      id={item.product_id}
                      addToCartFromList={addToCartFromList}
                    />
                  ))
                : categoryData.products.map((item) => (
                    <ListItem
                      key={item.product_id}
                      link={`/products/${item.slug}`}
                      title={item.name}
                      price={item.price}
                      brand={item.brand}
                      rating={item.rating}
                      image={item.images}
                      id={item.product_id}
                      addToCartFromList={addToCartFromList}
                    />
                  ))}
            </CategorizedItems>
          </ErrorBoundary>
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
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
