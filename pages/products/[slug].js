import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useContext } from "react"
import AddCart from "../../components/shopping/AddCart"
import SaveItem from "../../components/shopping/SaveItem"
import Image from "../../components/common/Image"
import Breadcrumb from "../../components/common/Breadcrumb"
import StarRating from "../../components/shopping/StarRatings"
import ProductSpecifications from "../../components/products/ProductSpecifications"
import ProductReviews from "../../components/products/ProductReviews"
import ProductHighlights from "../../components/products/ProductHighlights"
import styled, { keyframes } from "styled-components"
import { Accordion, AccordionItem as Item } from "@szhsin/react-accordion"
import ChevronDown from "../../public/chevron-down.svg"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import ProductInclusions from "../../components/products/ProductInclusions"
import QuantityPicker from "../../components/shopping/QuantityPicker"
import ShippingInfo from "../../components/shopping/ShippingInfo"
import { IoChevronDownOutline } from "react-icons/io5"
import { IoLocationOutline } from "react-icons/io5"
import { LiaTruckSolid } from "react-icons/lia"
import { PiKeyReturn } from "react-icons/pi"
import { RiArrowDownSLine, RiArrowLeftSLine } from "react-icons/ri"
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { useMobileView } from "../../components/common/MobileViewDetector"

import { useSiteContext } from "../../context/mainContext"

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10%);
  }
  to {
    opacity: 1;
    transform: translateY(0%);
  }
`

const ItemWithChevron = ({ header, ...rest }) => (
  <Item
    {...rest}
    header={
      <>
        {header}
        <ChevronDown className="chevron-down" alt="Chevron Down" />
      </>
    }
  />
)

const AccordionWrapper = styled.div`
  padding: 15px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  border-radius: 8px;
  margin-top: 20px;
  background-color: white;
`

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`

const AccordionItem = styled(ItemWithChevron)`
  border-bottom: 1px solid #ccc;
  .szh-accordion__item {
    &-btn {
      cursor: pointer;
      display: flex;
      align-items: center;
      width: 100%;
      margin: 0;
      padding: 1rem;
      font-weight: bold;
      text-align: left;
      font-size: 19px;
      color: #000;
      background-color: transparent;
      border: none;
      &:hover {
        background-color: #f3f3f3;
        text-decoration: underline;
      }
    }

    &-content {
      transition: height 0.25s cubic-bezier(0, 0, 0, 1);
    }

    &-panel {
      padding: 1rem;
    }
  }

  .chevron-down {
    margin-left: auto;
    transition: transform 0.25s cubic-bezier(0, 0, 0, 1);
  }

  &.szh-accordion__item--expanded {
    .chevron-down {
      transform: rotate(180deg);
    }
  }
`

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 45px 15px 75px 15px;

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

const AdditionalImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  order: 3; // Make sure additional images are below the main image in mobile view

  @media (min-width: 768px) {
    order: 0; // Reset order in desktop view
  }
`

const AdditionalImageThumbnail = styled.div`
  border: 1px solid gray;
  border-radius: 6px;
  cursor: pointer;
  padding: 3px;
  width: 110px;
  height: 110px;
  display: grid;
  align-content: center;
  overflow: hidden;
  position: relative;
  background-color: white;

  &:hover {
    border: 1px solid var(--color-highlight);
  }

  img {
    width: 100%;
    height: 100%;
    padding: 3px;
    object-fit: scale-down;
    position: absolute;
    top: 0;
    left: 0;
  }
`

const CarouselContainer = styled.div`
  width: 100%;
  .carousel .slide img {
    height: 500px;
    object-fit: contain;
  }

  .thumbs-wrapper,
  .control-arrow,
  .carousel-status {
    display: none; // Don't render the overview thumbnails, control arrows, slide count..
  }

  @media (max-width: 768px) {
    .carousel .slide img {
      height: auto;
    }
  }
`

const ProductNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  order: 0; // Make sure product details are at the top in mobile view

  @media (min-width: 768px) {
    order: 0;
  }
`

const Product = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  order: 4; // Price and purchase buttons at the bottom in mobile view

  @media (min-width: 768px) {
    order: 1; // And below the product details in desktop view
  }

  h1 {
    font-size: 23px;
    font-weight: 800;
    line-height: 1.25;
    word-break: break-word;
  }

  h2 {
    font-size: 23px;
    font-weight: 700;
  }

  p {
    font-size: 14px;
  }
`

const CartBtnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 5px;
`

const ProductDescription = styled.div`
  p {
    font-size: 14px;
    display: inline-block;
    position: relative;
  }

  p::after {
    position: absolute;
    content: "";
    border-bottom: 1px solid #ccc;
    width: 100%;
    transform: translateX(-50%);
    bottom: -15px;
    left: 50%;
  }

  h1 {
    font-weight: bold;
    text-align: left;
    font-size: 16px;
  }
`

const ProductRatings = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 0;

  h2 {
    font-size: 13px;
    letter-spacing: 0.025em;
    margin-left: 5px;
  }
`

const ProductQna = styled.div`
  h3 {
    font-size: 19px;
    margin-bottom: 10px;
  }

  p {
    font-size: 14px;
  }
`

const MainImageContainer = styled.div`
  display: flex;
  justify-content: center;
  border-radius: 8px;
  padding: 25px;
  height: 500px;
  width: 100%;
  background-color: white;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;

  @media (max-width: 768px) {
    height: auto;
    width: 100%;
    order: 2; // Make sure main image is below the product details in mobile view
  }
`

const ProductImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`

const ZipWrapper = styled.div`
  display: flex;
  font-size: 16px;
  padding: 15px 0;
  position: relative;
  align-items: center;
`

const PopupContainer = styled.div`
  position: absolute;
  display: grid;
  grid-template-columns: 1fr 0.5fr;
  grid-template-rows: auto;
  top: 100%;
  left: 0;
  color: black;
  background-color: var(--color-main-white);
  border: 1px solid transparent;
  border-radius: 3px;
  padding: 8px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 4px 1px;
  animation: ${fadeIn} 0.3s ease;
  z-index: 100;

  &:before {
    content: "";
    background-color: inherit;
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -11px;
    z-index: -1;
    width: 18px;
    height: 10px;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
  }

  &:after {
    content: "";
    position: absolute;
    width: 10px;
    height: 10px;
    border-top-right-radius: 0px;
    border: 1px solid transparent;
    background-color: var(--color-main-white);
    z-index: -2;
    top: -6px;
    left: 50%;
    margin-left: -6px;
    transform: rotate(45deg);
    filter: drop-shadow(rgba(0, 0, 0, 0.2) 0px -2px 1px);
  }
`

const ZipForm = styled.input`
  border: 1px solid var(--color-border-gray);
  border-radius: 0.25rem;
  padding: 10px;
  color: var(--color-text-dark);
  line-height: 1.25;
  margin-right: 10px;

  &:focus + label,
  &:not(:placeholder-shown) + label {
    top: 0px;
    left: 15px;
    font-size: 12px;
    color: var(--color-text-dark);
  }
`

const Label = styled.label`
  position: absolute;
  top: 30%;
  left: 15px;
  color: var(--color-text-dark);
  background-color: var(--color-main-white);
  font-size: 16px;
  pointer-events: none;
  transition: all 0.3s ease;
`

const ZipUnderline = styled.div`
  display: flex;
  font-weight: 700;
  font-size: 16px;
  text-decoration: underline;
  margin: 0 5px;
`

const ZipDropdownBtn = styled.button`
  display: flex;
  cursor: pointer;
  align-items: center;
  user-select: none;
`

const ZipSubmitBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s ease-in 0s;
  border-radius: 6px;
  color: var(--color-button-dark-gray);
  border: medium;
  font-weight: bold;
  min-height: 44px;
  padding: 0px 16px;
  text-align: center;
  background-color: var(--color-button-mid-gray);
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-button-dark-gray);
    color: var(--color-button-mid-gray);
  }

  &:active {
    background-color: var(--color-button-dark-gray);
    color: var(--color-button-mid-gray);
  }

  &:focus-visible {
    background-color: var(--color-button-dark-gray);
    color: var(--color-button-mid-gray);
  }
`

const ShipWrapper = styled.div`
  display: flex;
  font-weight: 700;
  font-size: 16px;
  position: relative;
  align-items: center;
`

const DateWrapper = styled.div`
  display: flex;
  font-weight: 400;
  font-size: 16px;
`

const ShippingOffer = styled.div`
  display: flex;
  font-weight: 400;
  font-size: 16px;
  padding: 15px 0;
`

const ExchangeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 15px 0;
`

const ExchangeHeader = styled.span`
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 4px;
`

const ExchangeBox = styled.div`
  font-size: 24px;
  display: flex;
  align-items: center;
  margin-right: 8px;
`

const ExchangeContent = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 11px;
`

const ValidationMessage = styled.div`
  color: #d32f2f;
  font-size: 14px;
  bottom: -20px;
  text-align: left;
`

function ProductDetails() {
  const router = useRouter()
  const { slug } = router.query

  const [product, setProduct] = useState(null)
  const [categoryName, setCategoryName] = useState(null)
  const [categorySlug, setCategorySlug] = useState(null)
  const [hoveredImage, setHoveredImage] = useState(null) // We update this during the API fetch
  const [numberOfitems, updateNumberOfItems] = useState(1) // Start with 1 item as our quantity
  const { zipCode, setZipCode, deliveryDate, dayOfWeek, returnDate } =
    ShippingInfo()
  const [zipCodeValid, setZipCodeValid] = useState(true)
  const [isZipPopupVisible, setIsZipPopupVisible] = useState(false)
  const [enteredZipCode, setEnteredZipCode] = useState("")
  const { addToCart, cart } = useSiteContext()
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
      // Reset the ZIP code validity state when the user starts editing
      setZipCodeValid(true)
    }
  }

  const handleZipCodeBlur = () => {
    if (enteredZipCode.trim().length === 0) {
      // Reset ZIP code validity only if the field is empty when blurred
      setZipCodeValid(true)
    } else {
      // Validate ZIP code if field is not empty
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

  function addItemToCart(product) {
    // Restructure the object so it aligns with the category page implementation
    const formattedProduct = {
      id: product.product_id || product.id,
      price: parseFloat(product.price),
      name: product.name,
      brand: product.brand || "",
      slug: product.slug || "",
      rating: product.rating,
      image: {
        image_url:
          product.images && product.images.length > 0
            ? product.images[0].image_url
            : "",
        is_main: true,
      },
    }

    formattedProduct["quantity"] = numberOfitems

    addToCart(formattedProduct)
    console.log(formattedProduct)
  }

  function increment() {
    updateNumberOfItems(numberOfitems + 1)
  }

  function decrement() {
    if (numberOfitems === 1) return
    updateNumberOfItems(numberOfitems - 1)
  }

  useEffect(() => {
    //console.log("Product slug:", slug) // This is the slug parameter from the URL
    if (!slug) {
      // Handle the case where slug is not provided
      console.warn("No slug parameter provided.")
      return
    }

    // Fetch product details by slug from the API route
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/products/${slug}`)
        //console.log("API response:", response)

        if (response.ok) {
          const data = await response.json()
          //console.log("Product data:", data)
          // Sort images based on the is_main property
          const sortedImages = [...data.images].sort(
            (a, b) => b.is_main - a.is_main
          )
          data.images = sortedImages
          setProduct(data)
          setCategoryName(data.category_name)
          setCategorySlug(data.category_slug)
          setHoveredImage(sortedImages[0].image_url)
        } else {
          console.error("Error fetching product details:", response.status)
        }
      } catch (error) {
        console.error("Error:", error)
      }
    }

    fetchProductDetails()
  }, [slug])

  if (!product) {
    return (
      <SpinnerContainer>
        <LoadingSpinner />
      </SpinnerContainer>
    )
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
          {!isMobileView && (
            <AdditionalImageContainer>
              {product.images.map((image, index) => (
                <AdditionalImageThumbnail
                  key={index}
                  className={
                    hoveredImage === image.image_url
                      ? "additional-image-hovered"
                      : ""
                  }
                  onMouseOver={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setHoveredImage(image.image_url)
                  }}
                >
                  <Image
                    src={image.image_url}
                    alt={`Product Thumbnail ${index} - ${product.name}`}
                  />
                </AdditionalImageThumbnail>
              ))}
            </AdditionalImageContainer>
          )}
          <MainImageContainer>
            {isMobileView ? (
              <CarouselContainer>
                <Carousel showThumbs>
                  {product.images.map((image, index) => (
                    <div key={index}>
                      <img
                        src={image.image_url}
                        alt={`Product Image ${index} - ${product.name}`}
                      />
                    </div>
                  ))}
                </Carousel>
              </CarouselContainer>
            ) : (
              <ProductImage src={hoveredImage} alt="Inventory item" />
            )}
          </MainImageContainer>
          {isMobileView ? (
            <>
              <ProductNameWrapper>
                <h1>{product.name}</h1>
                <ProductRatings>
                  <div>
                    <StarRating reviews={product.reviews} />
                  </div>
                  <p>
                    {product.reviews.length === 0
                      ? "Be the first to write a review"
                      : `(${product.reviews.length} review${
                          product.reviews.length !== 1 ? "s" : ""
                        })`}
                  </p>
                </ProductRatings>
              </ProductNameWrapper>
              <Product>
                <h2>${product.price}</h2>
                <ExchangeWrapper>
                  <ExchangeBox>
                    <PiKeyReturn />
                  </ExchangeBox>
                  <ExchangeContent>
                    <ExchangeHeader>15-DAY FREE & EASY RETURNS</ExchangeHeader>
                    <p>
                      If received {dayOfWeek}, the last day to return this item
                      would be {returnDate}.
                    </p>
                  </ExchangeContent>
                </ExchangeWrapper>
                <CartBtnWrapper>
                  <AddCart
                    title="Add to Cart"
                    onClick={() => addItemToCart(product)}
                  />
                  <SaveItem
                    title="Save for Later"
                    onClick={() => addItemToCart(product)}
                  />
                </CartBtnWrapper>
                <ZipWrapper>
                  <IoLocationOutline style={{ marginRight: "5px" }} size={24} />
                  Delivery to{" "}
                  <ZipDropdownBtn onClick={toggleZipPopup}>
                    <ZipUnderline>{zipCode}</ZipUnderline>
                    {isZipPopupVisible && (
                      <PopupContainer onClick={(e) => e.stopPropagation()}>
                        <ZipForm
                          type="tel"
                          name="zipCode"
                          placeholder=""
                          value={enteredZipCode}
                          isOpen={isOpen}
                          aria-haspopup="true"
                          aria-expanded={isOpen}
                          onChange={handleZipCodeChange}
                          style={!zipCodeValid ? invalidStyle : {}}
                          onBlur={handleZipCodeBlur}
                        />
                        <Label
                          htmlFor="zip"
                          style={!zipCodeValid ? invalidStyle : {}}
                        >
                          Enter ZIP Code
                        </Label>
                        <ZipSubmitBtn onClick={handleZipCodeSubmit}>
                          Submit
                        </ZipSubmitBtn>
                        {!zipCodeValid && (
                          <ValidationMessage>
                            Please enter a valid ZIP code.
                          </ValidationMessage>
                        )}
                      </PopupContainer>
                    )}
                    <div
                      className={`arrow-icon ${isOpen ? "rotate-arrow" : ""}`}
                      style={{ opacity: 1 }}
                    >
                      <RiArrowDownSLine />
                    </div>
                  </ZipDropdownBtn>
                </ZipWrapper>
                <DateWrapper>Get it by {deliveryDate}</DateWrapper>
                <ShipWrapper>
                  <LiaTruckSolid style={{ marginRight: "5px" }} size={24} />
                  <ShippingOffer>Free Shipping</ShippingOffer>
                </ShipWrapper>
              </Product>
            </>
          ) : (
            <ProductNameWrapper>
              <h1>{product.name}</h1>
              <ProductRatings>
                <div>
                  <StarRating reviews={product.reviews} />
                </div>
                <p>
                  {product.reviews.length === 0
                    ? "Be the first to write a review"
                    : `(${product.reviews.length} review${
                        product.reviews.length !== 1 ? "s" : ""
                      })`}
                </p>
              </ProductRatings>
              <Product>
                <h2>${product.price}</h2>
                <ExchangeWrapper>
                  <ExchangeBox>
                    <PiKeyReturn />
                  </ExchangeBox>
                  <ExchangeContent>
                    <ExchangeHeader>15-DAY FREE & EASY RETURNS</ExchangeHeader>
                    <p>
                      If received {dayOfWeek}, the last day to return this item
                      would be {returnDate}.
                    </p>
                  </ExchangeContent>
                </ExchangeWrapper>
                <CartBtnWrapper>
                  <AddCart
                    title="Add to Cart"
                    onClick={() => addItemToCart(product)}
                  />
                  <SaveItem
                    title="Save for Later"
                    onClick={() => addItemToCart(product)}
                  />
                </CartBtnWrapper>
                <ZipWrapper>
                  <IoLocationOutline style={{ marginRight: "5px" }} size={24} />
                  Delivery to{" "}
                  <ZipDropdownBtn onClick={toggleZipPopup}>
                    <ZipUnderline>{zipCode}</ZipUnderline>
                    {isZipPopupVisible && (
                      <PopupContainer onClick={(e) => e.stopPropagation()}>
                        <ZipForm
                          type="tel"
                          name="zipCode"
                          placeholder=""
                          value={enteredZipCode}
                          isOpen={isOpen}
                          aria-haspopup="true"
                          aria-expanded={isOpen}
                          onChange={handleZipCodeChange}
                          style={!zipCodeValid ? invalidStyle : {}}
                          onBlur={handleZipCodeBlur}
                        />
                        <Label
                          htmlFor="zip"
                          style={!zipCodeValid ? invalidStyle : {}}
                        >
                          Enter ZIP Code
                        </Label>
                        <ZipSubmitBtn onClick={handleZipCodeSubmit}>
                          Submit
                        </ZipSubmitBtn>
                        {!zipCodeValid && (
                          <ValidationMessage>
                            Please enter a valid ZIP code.
                          </ValidationMessage>
                        )}
                      </PopupContainer>
                    )}
                    <div
                      className={`arrow-icon ${isOpen ? "rotate-arrow" : ""}`}
                      style={{ opacity: 1 }}
                    >
                      <RiArrowDownSLine />
                    </div>
                  </ZipDropdownBtn>
                </ZipWrapper>
                <DateWrapper>Get it by {deliveryDate}</DateWrapper>
                <ShipWrapper>
                  <LiaTruckSolid style={{ marginRight: "5px" }} size={24} />
                  <ShippingOffer>Free Shipping</ShippingOffer>
                </ShipWrapper>
              </Product>
            </ProductNameWrapper>
          )}
        </MainSection>
        <AccordionWrapper>
          <Accordion transition transitionTimeout={250}>
            <AccordionItem header="Overview" initialEntered>
              <ProductDescription>
                <h1>Description</h1>
                <p>{product.description}</p>
              </ProductDescription>
              <ProductHighlights highlights={product.highlights} />
              <ProductInclusions inclusions={product.inclusions} />
            </AccordionItem>
            <AccordionItem header="Specifications">
              <ProductSpecifications attributes={product.attributes} />
            </AccordionItem>
            <AccordionItem header="Reviews">
              <ProductReviews reviews={product.reviews} />
            </AccordionItem>
            <AccordionItem header="Q&A">
              <ProductQna>
                <p>Todo: Implement Q&A logic</p>
              </ProductQna>
            </AccordionItem>
          </Accordion>
        </AccordionWrapper>
      </PageWrapper>
    </div>
  )
}

export default ProductDetails
