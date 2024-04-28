import React from "react"
import styled from "styled-components"

const ProductInclusionsWrapper = styled.div`
  display: grid;
  padding-top: 10px;
  grid-template-columns: 1fr 3fr; /* Adjusted grid columns */

  position: relative; /* Establish positioning context for pseudo-element */
`

const Title = styled.h1`
  font-weight: bold;
  text-align: left;
  font-size: 16px;
  padding-top: 15px;
`

const InclusionList = styled.ul`
  list-style-type: none;
  padding: 1rem 1rem 0rem 0rem;
`

const InclusionItem = styled.li`
  margin-bottom: 10px;
`

const InclusionsContent = styled.div`
  display: flex;
  flex-direction: column;

  p {
    font-size: 14px;
    font-weight: bold;
  }
`

const Divider = styled.div`
  position: absolute;
  border-bottom: 1px solid #ccc;
  width: 100%;
  top: 10px;
  grid-column: 2; /* Occupy the second fractional unit */
`

const ProductInclusions = ({ inclusions }) => {
  return (
    <ProductInclusionsWrapper>
      <Title>What's Included</Title>
      <Divider />
      <InclusionList>
        {inclusions &&
          Array.isArray(inclusions) &&
          inclusions.map((inclusion) => (
            <InclusionItem
              key={inclusion.id /* assuming inclusion has unique ID */}
            >
              <InclusionsContent>
                <p>{inclusion.inclusion_description}</p>
              </InclusionsContent>
            </InclusionItem>
          ))}
      </InclusionList>
    </ProductInclusionsWrapper>
  )
}

export default ProductInclusions
