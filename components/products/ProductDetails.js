import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import styled from "styled-components"
import LoaderDots from "../../components/loaders/LoaderDots"
import Breadcrumb from "../../components/common/Breadcrumb"
import { useMobileView } from "../../context/MobileViewContext"
import ShippingInfo from "../../components/shopping/ShippingInfo"
import ProductImageGallery from "../../components/products/ProductImageGallery"
import ProductInfo from "../../components/products/ProductInfo"
import ProductAccordion from "../../components/products/ProductAccordion"

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 25px 15px 75px 15px;

  @media (min-width: 768px) {
    padding: 45px 75px 75px 75px;
  }
`

const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`

function ProductDetails() {
  const router = useRouter()
  const { slug } = router.query

  const [product, setProduct] = useState(null)
  const [categoryName, setCategoryName] = useState(null)
  const [categorySlug, setCategorySlug] = useState(null)
  const [hoveredImage, setHoveredImage] = useState(null)
  const { zipCode, setZipCode, deliveryDate, dayOfWeek, returnDate } =
    ShippingInfo()
  const [zipCodeValid, setZipCodeValid] = useState(true)
  const [isZipPopupVisible, setIsZipPopupVisible] = useState(false)
  const [enteredZipCode, setEnteredZipCode] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const isMobileView = useMobileView()

  const toggleZipPopup = () => {
    setIsZipPopupVisible(!isZipPopupVisible)
    setIsOpen(!isOpen)
  }

  const handleZipCodeChange = (event) => {
    const { name, value } = event.target
    if (name === "zipCode") {
      setEnteredZipCode(value)
      setZipCodeValid(true)
    }
  }

  const handleZipCodeBlur = () => {
    if (enteredZipCode.trim().length === 0) {
      setZipCodeValid(true)
    } else {
      setZipCodeValid(/^[0-9]{5}$/.test(enteredZipCode))
    }
  }

  const handleZipCodeSubmit = () => {
    const zipCodePattern = /^[0-9]{5}$/
    if (zipCodePattern.test(enteredZipCode)) {
      setZipCode(enteredZipCode)
      setIsZipPopupVisible(false)
    } else {
      setZipCodeValid(false)
    }
  }

  useEffect(() => {
    // Fetch product details by slug from the API route
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/products/${slug}`, {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
          },
        })

        if (response.ok) {
          const data = await response.json()
          // Sort images based on the is_main property
          const sortedImages = [...data.images].sort(
            (a, b) => b.is_main - a.is_main
          )
          data.images = sortedImages
          setProduct(data)
          setCategoryName(data.category_name)
          setCategorySlug(data.category_slug)
          setHoveredImage(sortedImages[0].image_url)
        }
      } catch (error) {
        console.error("Error:", error)
      }
    }

    if (slug) {
      // Don't run until the slug value is available
      fetchProductDetails()
    }
  }, [slug])

  if (!product) {
    return <LoaderDots />
  }

  // Apply red border/text if information is invalid
  const invalidStyle = { borderColor: "#D32F2F", color: "#D32F2F" }

  return (
    <div>
      <Head>
        <title>{product.name}</title>
        <meta name="description" content={product.description} />
        <meta
          property="og:title"
          content={`TechNexus - ${product.name}`}
          key="title"
        />
      </Head>
      <Breadcrumb categoryName={categoryName} categorySlug={categorySlug} />
      <PageWrapper>
        <MainSection>
          <ProductImageGallery
            product={product}
            hoveredImage={hoveredImage}
            setHoveredImage={setHoveredImage}
            isMobileView={isMobileView}
          />
          <ProductInfo
            product={product}
            zipCode={zipCode}
            toggleZipPopup={toggleZipPopup}
            isZipPopupVisible={isZipPopupVisible}
            enteredZipCode={enteredZipCode}
            isOpen={isOpen}
            handleZipCodeChange={handleZipCodeChange}
            invalidStyle={invalidStyle}
            handleZipCodeBlur={handleZipCodeBlur}
            handleZipCodeSubmit={handleZipCodeSubmit}
            zipCodeValid={zipCodeValid}
            deliveryDate={deliveryDate}
            dayOfWeek={dayOfWeek}
            returnDate={returnDate}
          />
        </MainSection>
        <ProductAccordion product={product} />
      </PageWrapper>
    </div>
  )
}

export default ProductDetails
