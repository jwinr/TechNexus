import React from "react"
import styled from "styled-components"
import StarRatings from "../shopping/StarRatings"

const Rating = styled.h1`
  font-size: 14px;
  color: rgb(102, 102, 102);
`

const ItemRating = ({ reviews }) => {
  //console.log("Rating:", reviews)
  return (
    <div>
      <StarRatings reviews={reviews} />
    </div>
  )
}

export default ItemRating
