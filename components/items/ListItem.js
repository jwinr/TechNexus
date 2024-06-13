import React, { useState, useEffect, useContext } from "react"
import Link from "next/link"
import Image from "../common/Image"
import AddCart from "../shopping/AddCart"
import styled from "styled-components"
import ItemTitle from "../items/ItemTitle"
import ItemPrice from "../items/ItemPrice"
import ItemBrand from "../items/ItemBrand"
import ItemRating from "../items/ItemRating"
import { LiaTruckMovingSolid } from "react-icons/lia"
import { LiaBookmark } from "react-icons/lia"
import { WishlistContext } from "../../context/WishlistContext"

const ListItemWrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto auto auto; /* Set fixed height for each row */
  align-content: space-between;
  padding: 15px;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: var(--sc-color-white);
  border-radius: 8px;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px;
`

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px; /* Fix the white bg overlap */
  transition: background-color 0.3s, border-color 0.3s, color 0.3s;
  padding: 8px;
  height: 218px;

  &:hover {
    background-color: var(--sc-color-white);
    border-color: var(--sc-color-border-gray);
  }
`

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  cursor: pointer;
`

const Bookmark = styled.button`
  padding: 10px;
  height: 44px;
  font-size: 22px;
  border-radius: 50%;
  color: var(--sc-color-text);
  display: flex;
  grid-area: bookmark;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--sc-color-border-gray);
`

const Details = styled.div`
  display: grid;
  grid-template-areas:
    "brand bookmark"
    "ratings bookmark"
    "price price";
  grid-template-columns: 1fr 0.1fr;
`

const RatingWrapper = styled.div`
  display: grid;
  grid-area: ratings;
`

const PriceWrapper = styled.div`
  display: grid;
  grid-area: price;
`

const ShippingContainer = styled.div`
  display: flex;
  padding: 10px 0;
  font-size: 14px;
  align-items: center;
`

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-right: 5px;
  font-size: 20px;
`

const ListItem = ({
  link,
  title,
  price,
  brand,
  rating,
  image,
  id,
  addToCartFromList,
}) => {
  const { addToWishlist } = useContext(WishlistContext)

  const handleAddToWishlist = () => {
    if (addToWishlist) {
      const product = {
        slug: link,
        id: id,
        name: title,
        price: parseFloat(price), // Convert string price to float
        quantity: 1,
        brand: brand || "",
        rating: rating || [],
        image: image[0],
      }

      addToWishlist(product)
    }
  }

  const [currentImage, setCurrentImage] = useState(
    image.find((image) => image.is_main)
  )

  // Update the currentImage when the image prop changes
  useEffect(() => {
    setCurrentImage(image.find((image) => image.is_main))
  }, [image])

  // Conditional check to ensure currentImage is defined, if not, fallback to a placeholder
  const imageUrl = currentImage
    ? currentImage.image_url
    : "/src/images/products/placeholder.jpg"

  const handleAddToCartClick = () => {
    if (addToCartFromList) {
      const product = {
        slug: link,
        id: id,
        name: title,
        price: parseFloat(price), // Convert string price to float
        quantity: 1,
        brand: brand || "",
        rating: rating || [],
        image: image[0],
      }

      addToCartFromList(product)
    }
  }

  return (
    <ListItemWrapper>
      <Link href={`${link}`}>
        <Container>
          <ItemWrapper>
            <Image alt={title} src={imageUrl} className="item-image-shrink" />
          </ItemWrapper>
        </Container>
      </Link>
      <Link href={`${link}`}>
        <ItemTitle title={title} />
      </Link>
      <Details>
        <ItemBrand brand={brand} />
        <RatingWrapper>
          <ItemRating reviews={rating} />
        </RatingWrapper>
        <PriceWrapper>
          <ItemPrice price={`$${price}`} />
        </PriceWrapper>
        <Bookmark onClick={handleAddToWishlist}>
          <LiaBookmark />
        </Bookmark>
      </Details>
      <ShippingContainer>
        <IconContainer>
          <LiaTruckMovingSolid />
        </IconContainer>
        <p>Free Shipping</p>
      </ShippingContainer>
      <AddCart full title="Add to Cart " onClick={handleAddToCartClick} />
    </ListItemWrapper>
  )
}

export default ListItem
