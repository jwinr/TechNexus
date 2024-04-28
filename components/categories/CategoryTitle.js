import styled from "styled-components"

const TitleWrapper = styled.div`
  grid-area: title;
`

const Title = styled.h1`
  font-size: 34px;
  font-weight: 600;
`

const CategoryTitle = ({ title }) => {
  return (
    <TitleWrapper>
      <Title>{title}</Title>
    </TitleWrapper>
  )
}

export default CategoryTitle
