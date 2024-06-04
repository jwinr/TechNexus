import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Image from "next/image"
import Link from "next/link"

const Container = styled.div`
  background-color: #dff3ff;
  border-radius: 12px;
  gap: 20px;
  display: grid;
  grid-area: top-deals;
  grid-template-columns: repeat(5, 1fr);
  padding: 20px;
`

const ItemContainer = styled.div`
  padding: 15px;
  background-color: var(--color-main-white);
  border-radius: 8px;
`

const ImgContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px; /* Fix the white bg overlap */
  transition: background-color 0.3s, border-color 0.3s, color 0.3s;
  padding: 8px;
  height: 218px;

  &:hover {
    background-color: var(--color-main-white);
    border-color: var(--color-border-gray);
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

const PriceContainer = styled.div`
  display: grid;
`

const TopDeals = () => {
  const [deals, setDeals] = useState([])

  useEffect(() => {
    fetch(`/api/deals`)
      .then((response) => response.json())
      .then((data) => setDeals(data))
      .catch((error) => console.error("Error fetching deals:", error))
  }, []) // The empty dependency array ensures the effect runs only once

  const loveDeals = deals.filter((deal) => deal.category === "deals_love")

  return (
    <Container>
      {loveDeals.map((deal, index) => (
        <ItemContainer key={index}>
          <Link href={`products/${deal.slug}`}>
            <ImgContainer>
              <ItemWrapper>
                <Image
                  alt={deal.name}
                  src={deal.image_url}
                  width={1540}
                  height={649}
                  className="item-image-shrink"
                />
              </ItemWrapper>
            </ImgContainer>
          </Link>
          <p>{deal.name}</p>
          <PriceContainer>
            <p>Original Price: ${deal.price}</p>
            <p>
              Discounted Price: $
              {(deal.price - deal.discount_amount).toFixed(2)}
            </p>
          </PriceContainer>
        </ItemContainer>
      ))}
    </Container>
  )
}

export default TopDeals
