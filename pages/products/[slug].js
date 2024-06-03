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
import styled from "styled-components"
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

import { useSiteContext } from "../../context/mainContext"

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

const Wrapper = styled.div`
  grid-area: desc;
  padding: 15px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  border-radius: 8px;
`

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; // Center vertically on the entire viewport height
`

/**
 * @type {React.ExoticComponent<import('@szhsin/react-accordion').AccordionItemProps>}
 */
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
  display: grid;
  grid-template-areas:
    "thumbnails product details"
    "desc desc desc";
  grid-template-columns: 0.5fr 3fr 2fr;
  padding: 45px 75px 75px 75px; // Offset for the breadcrumb
  grid-row-gap: 20px;
  grid-column-gap: 50px;
`

const AdditionalImageContainer = styled.div`
  grid-area: thumbnails;
  flex-direction: column;
  display: flex;
  justify-content: flex-start;
  gap: 20px;
`

const AdditionalImageThumbnail = styled.div`
  border: 1px solid gray;
  border-radius: 6px;
  cursor: pointer; /* Pointer cursor when hovering */
  padding: 3px; /* Offset for the border */
  width: 100px;
  height: 100px;
  display: grid;
  align-content: center;
  overflow: hidden;
  position: relative;

  &:hover {
    border: 1px solid #4fbbff;
  }

  img {
    width: 100%;
    height: 100%;
    padding: 3px;
    object-fit: scale-down; /* Fallback for browsers that support object-fit */
    position: absolute;
    top: 0;
    left: 0;
  }
`

const Product = styled.div`
  grid-area: details;
  justify-content: flex-start;
  display: flex;
  flex-direction: column;
  align-content: flex-start;

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
  padding-top: 5px; // Push it down from the price tag
`

const ProductDescription = styled.div`
  grid-template-columns: 1fr 3fr;
  display: grid;

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
  grid-area: desc;

  h3 {
    font-size: 19px;
    margin-bottom: 10px;
  }

  p {
    font-size: 14px;
  }
`

const MainImageContainer = styled.div`
  grid-area: product;

  justify-content: center;
  max-height: 460px;
  display: flex;
`

const ProductImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`

const ZipWrapper = styled.div`
  display: flex;
  font-weight: 700;
  font-size: 16px;
  padding: 15px 0;
  position: relative;
  align-items: center;
`

const ShipWrapper = styled.div`
  display: flex;
  font-weight: 700;
  font-size: 16px;
  position: relative;
  align-items: center;
`

const ZipUnderline = styled.div`
  display: flex;
  font-weight: 700;
  font-size: 16px;
  text-decoration: underline;
  margin: 0 5px;
`

const ZipButton = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  user-select: none; // Prevent highlighting of text elements when the user clicks the dropdown
`

const PopupContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  z-index: 100;
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
  margin: 8px 0;
  padding: 12px 8px;
  background-color: #f0f0f0;
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
  const [isZipPopupVisible, setIsZipPopupVisible] = useState(false)
  const [enteredZipCode, setEnteredZipCode] = useState("")
  const { addToCart, cart } = useSiteContext()

  const toggleZipPopup = () => {
    setIsZipPopupVisible(!isZipPopupVisible)
  }

  const handleZipCodeChange = (event) => {
    setEnteredZipCode(event.target.value)
  }

  const handleZipCodeSubmit = () => {
    setZipCode(enteredZipCode)
    setIsZipPopupVisible(false)
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
        <MainImageContainer>
          <ProductImage src={hoveredImage} alt="Inventory item" />
        </MainImageContainer>
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
                e.stopPropagation() // Stop the event from propagating up the DOM tree
                setHoveredImage(image.image_url)
              }}
            >
              <Image
                src={image.image_url}
                alt={`Product Thumbnail ${index}` + " - " + product.name}
                // Dynamically generate alt text based on product name
              />
            </AdditionalImageThumbnail>
          ))}
        </AdditionalImageContainer>
        <Product>
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
          <h2>${product.price}</h2>
          <ExchangeWrapper>
            <ExchangeBox>
              <PiKeyReturn />
            </ExchangeBox>
            <ExchangeContent>
              <ExchangeHeader>15-DAY FREE & EASY RETURNS</ExchangeHeader>
              <p>
                If received {dayOfWeek}, the last day to return this item would
                be {returnDate}.
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
            <ZipButton onClick={toggleZipPopup}>
              <ZipUnderline>{zipCode}</ZipUnderline>
              {isZipPopupVisible && (
                <PopupContainer onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    placeholder="Enter ZIP code"
                    value={enteredZipCode}
                    onChange={handleZipCodeChange}
                  />
                  <button onClick={handleZipCodeSubmit}>Submit</button>
                </PopupContainer>
              )}
              <IoChevronDownOutline />
            </ZipButton>
          </ZipWrapper>
          <DateWrapper>Get it by {deliveryDate}</DateWrapper>
          <ShipWrapper>
            <LiaTruckSolid style={{ marginRight: "5px" }} size={24} />
            <ShippingOffer>Free Shipping</ShippingOffer>
          </ShipWrapper>
        </Product>
        <Wrapper>
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
        </Wrapper>
      </PageWrapper>
    </div>
  )
}

export default ProductDetails
