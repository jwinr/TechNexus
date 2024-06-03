import Image from "../common/Image"
import Link from "next/link"
import styled from "styled-components"

const ListItemWrapper = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`

const Container = styled.div`
  height: 14rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background-color: var(--color-main-white);
  border: 1px solid #d1d5db;
  transition: background-color 0.3s, border-color 0.3s, color 0.3s;

  &:hover {
    background-color: #f1f1f1;
    border-color: #a1a1a1;
  }
`

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const ListCategory = ({ imageSrc, title, link }) => {
  return (
    <ListItemWrapper>
      <Link href={`${link}`} aria-label={title}>
        <Container>
          <ItemWrapper>
            <Image src={imageSrc} alt={title} className="item-image-shrink" />
          </ItemWrapper>
        </Container>
        <p className="item-title">{title}</p>
      </Link>
    </ListItemWrapper>
  )
}

export default ListCategory
