import React, { useState } from "react";
import styled from "styled-components";

// Import the Image component and define 'product' and 'additionalImages' if not already done.
// Replace placeholders below with actual values or imports.

// import Image from 'your-image-library'; // Import the 'Image' component.

// Define or import 'product' and 'additionalImages'.
// const product = { image_url: 'main-image-url', is_main: true };
// const additionalImages = [/* array of additional images */];

const AdditionalImageContainer = styled.div`
  grid-area: thumbnails;
  flex-direction: column;
  display: flex;
  justify-content: space-between;
  width: 50%;
`;

function ImageView() {
  const images = [product, ...additionalImages]; // additionalImages is an array of additional images

  const MainImage = images.find((img) => img.is_main);
  const restOfImages = images.filter((img) => !img.is_main);

  const [hoveredImage, setHoveredImage] = useState(MainImage.image_url);

  return (
    <div>
      <div className="main-image-container">
        <Image
          src={hoveredImage}
          alt="Inventory item"
          className="product-image-full"
        />
      </div>

      <AdditionalImageContainer>
        {images.map((image, index) => (
          <div
            key={index}
            className={`additional-image-thumbnail ${
              hoveredImage === image.image_url ? "additional-image-hovered" : ""
            }`}
            onMouseEnter={() => setHoveredImage(image.image_url)}
          >
            <Image src={image.image_url} alt={`Product Thumbnail ${index}`} />
          </div>
        )}
      </AdditionalImageContainer>
    </div>
  );
}

export default ImageView;
