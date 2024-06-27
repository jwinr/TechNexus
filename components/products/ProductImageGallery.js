import Image from "next/image"
import styled from "styled-components"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import { Pagination } from "swiper/modules"
import { useState, useRef } from "react"
import PropFilter from "../../utils/PropFilter"

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
    border: 1px solid var(--sc-color-blue-highlight);
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
  display: flex;
  border-radius: 8px;
  width: 100%;
  background-color: white;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  order: 2; // Make sure main image is below the product details in mobile view

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img {
    padding: 25px; // Applying padding to the image itself so there isn't horizontal white space
    height: 500px;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    img {
      height: 300px;
    }
  }
`

const MainImageContainer = styled(PropFilter("div")(["zoomed"]))`
  display: flex;
  justify-content: center;
  border-radius: 8px;
  padding: 25px;
  height: 500px;
  width: 100%;
  background-color: var(--sc-color-white);
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  overflow: hidden;
  position: relative;
  cursor: ${(props) => (props.zoomed ? "zoom-out" : "zoom-in")};
  user-select: none;
  outline: none;

  @media (max-width: 768px) {
    padding: 25px 0; // We don't need side padding, or else there will be white space during the carousel transitions
    height: 350px;
    width: 100%;
    order: 2; // Make sure main image is below the product details in mobile view
  }

  img {
    height: min-content;
    width: auto;
    align-self: center;
    transition: transform 0.3s ease;
    transform: ${(props) => (props.zoomed ? "scale(1.5)" : "scale(1)")};
    user-select: none; /* Prevent text selection */
    outline: none; /* Remove outline */
  }
`

const ProductImageGallery = ({
  product,
  hoveredImage,
  setHoveredImage,
  isMobileView,
}) => {
  const [zoomed, setZoomed] = useState(false)
  const mainImageContainerRef = useRef(null)
  const imageRef = useRef(null)

  const handleImageClick = (e) => {
    const { left, top, width, height } =
      mainImageContainerRef.current.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    imageRef.current.style.transformOrigin = `${x}% ${y}%`
    setZoomed((prevZoomed) => !prevZoomed)
  }

  const handleMouseMove = (e) => {
    if (zoomed) {
      const { left, top, width, height } =
        mainImageContainerRef.current.getBoundingClientRect()
      const x = ((e.clientX - left) / width) * 100
      const y = ((e.clientY - top) / height) * 100
      imageRef.current.style.transformOrigin = `${x}% ${y}%`
    }
  }

  const handleMouseLeave = () => {
    if (zoomed) {
      setZoomed(false)
    }
  }

  return (
    <>
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
                width="500"
                height="500"
                alt={`Product Thumbnail ${index} - ${product.name}`}
              />
            </AdditionalImageThumbnail>
          ))}
        </AdditionalImageContainer>
      )}
      {isMobileView ? (
        <CarouselContainer>
          <Swiper
            pagination={{ dynamicBullets: true }}
            modules={[Pagination]}
            spaceBetween={10}
          >
            {product.images.map((image, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={image.image_url}
                  width="500"
                  height="500"
                  alt={`Product Image ${index} - ${product.name}`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </CarouselContainer>
      ) : (
        <MainImageContainer
          ref={mainImageContainerRef}
          onClick={handleImageClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          zoomed={zoomed}
        >
          <Image
            ref={imageRef}
            src={hoveredImage}
            width="500"
            height="500"
            alt="Inventory item"
            priority="true"
          />
        </MainImageContainer>
      )}
    </>
  )
}

export default ProductImageGallery
