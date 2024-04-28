import React, { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import styled from "styled-components"
import "swiper/css"
import "swiper/css/navigation"
import { Navigation } from "swiper/modules"
import Image from "next/image"

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;

  img {
    user-select: none; // Prevent the image from being highlighted when changing slides
  }
`

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 50px;
  padding: 0 100px;
`

const Wrapper = styled.div`
  display: flex;
`

const BrandSwiper = () => {
  const [brandsData, setBrandsData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/brands")
        if (response.ok) {
          const data = await response.json()
          setBrandsData(data)
        } else {
          throw new Error("Error fetching data")
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  const chunkArray = (array, chunkSize) => {
    const result = []
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize))
    }
    return result
  }

  return (
    <Swiper navigation={true} modules={[Navigation]}>
      {chunkArray(brandsData, 4).map((chunk, index) => (
        <SwiperSlide key={index}>
          <Container>
            {chunk.map((brand, i) => (
              <Wrapper key={i}>
                <ImageContainer>
                  <Image
                    src={brand.image}
                    width={300}
                    height={161}
                    alt={brand.name}
                  />
                </ImageContainer>
              </Wrapper>
            ))}
          </Container>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default BrandSwiper
