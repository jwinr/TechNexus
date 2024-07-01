import React, {
  useEffect,
  useState,
  lazy,
  Suspense,
  useCallback,
  useMemo,
} from "react"
import { useRouter } from "next/router"
import styled from "styled-components"
import Head from "next/head"
import Breadcrumb from "../../components/common/Breadcrumb"
import ProductCard from "../../components/products/ProductCard"
import LoaderDots from "../../components/loaders/LoaderDots"
import { useMobileView } from "../../context/MobileViewContext"
import ErrorBoundary from "../../components/common/ErrorBoundary"
import { useFilters } from "../../context/FilterContext"
import PropFilter from "../../utils/PropFilter"

// Lazy-loaded components
const ProductFilters = lazy(() =>
  import("../../components/products/ProductFilters")
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
const CategorizedItemsContainer = styled(PropFilter("div")(["isVisible"]))`
  display: grid;
  grid-area: items;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 35px;
  padding: 5px 75px 0px 75px;
  transition: opacity 0.3s ease-in-out;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  z-index: 100;

  @media (max-width: 768px) {
    max-width: 100vw;
    display: flex;
    flex-direction: column;
    padding: 10px;
    gap: 5px;
  }
`

const TitleWrapper = styled.div`
  display: flex;
  padding: 0px 30px;
  grid-area: title;

  h1 {
    font-size: 34px;
    font-weight: 600;
  }
`

const MemoizedProductCard = React.memo(ProductCard)

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
  const fetchCategoryData = useCallback(
    (page) => {
      setLoading(true)
      fetch(`/api/categories/${slug}?page=${page}&limit=${productsPerPage}`, {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json()
          } else if (response.status === 429) {
            throw new Error(
              "You've made too many requests in a short period. Please try again later."
            )
          } else if (response.status === 404) {
            throw new Error("Category not found")
          } else {
            throw new Error("An unexpected error occurred.")
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
    },
    [slug]
  )

  useEffect(() => {
    if (slug) {
      fetchCategoryData(currentPage)
    }
  }, [slug, currentPage, fetchCategoryData])

  const handleRouteChange = useCallback((url) => {
    const newPage =
      parseInt(new URL(url, window.location.origin).searchParams.get("page")) ||
      1
    setCurrentPage(newPage)
  }, [])

  useEffect(() => {
    router.events.on("routeChangeComplete", handleRouteChange)

    // Clean up the event listener
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [router.events, handleRouteChange])

  const handleFilterChange = useCallback(
    (selectedAttributes) => {
      setShowFilteredItems(false) // Hide items to trigger the fade-out animation

      // Construct the filter object to send to the backend
      const filters = Object.entries(selectedAttributes).reduce(
        (acc, [attribute_type, values]) => {
          if (values.length > 0) {
            acc[attribute_type] = values
          }
          return acc
        },
        {}
      )

      // Fetch filtered data from the server
      const slug = router.query.slug // Get the current category slug

      fetch(
        `/api/categories/${slug}?filters=${encodeURIComponent(
          JSON.stringify(filters)
        )}`,
        {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
          },
        }
      )
        .then((response) => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error("Failed to fetch filtered products")
          }
        })
        .then((data) => {
          setFilteredItems(data.products)
          setIsFilterActive(true)
          setShowFilteredItems(true) // Show items to trigger the fade-in animation
        })
        .catch((error) => {
          console.error("Error fetching filtered products:", error)
        })
    },
    [router.query.slug]
  )

  // Function to handle pagination
  const handlePageChange = useCallback(
    (newPage) => {
      setCurrentPage(newPage)
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, page: newPage },
        },
        undefined,
        { shallow: true }
      )
    },
    [router]
  )

  // Calculate the total number of pages
  const totalPages = useMemo(
    () =>
      categoryData ? Math.ceil(categoryData.totalCount / productsPerPage) : 1,
    [categoryData, productsPerPage]
  )

  if (loading) {
    return <LoaderDots />
  }

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
          <h1>{categoryData.name}</h1>
        </TitleWrapper>
        <Suspense fallback={<LoaderDots />}>
          <ErrorBoundary>
            <ProductFilters
              inventoryItems={categoryData.products}
              onFilterChange={handleFilterChange}
              attributes={categoryData.attributes}
            />
          </ErrorBoundary>
        </Suspense>
        <Suspense fallback={<LoaderDots />}>
          <ErrorBoundary>
            <CategorizedItemsContainer isVisible={true}>
              {(isFilterActive ? filteredItems : categoryData.products).map(
                (item) => (
                  <MemoizedProductCard
                    key={item.product_id}
                    link={`/products/${item.slug}`}
                    title={item.name}
                    price={item.price}
                    discount={item.sale_price}
                    brand={item.brand}
                    rating={item.rating}
                    image={item.images}
                    id={item.product_id}
                  />
                )
              )}
            </CategorizedItemsContainer>
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
