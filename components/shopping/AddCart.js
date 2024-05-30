import React, { useState } from "react"
import styled, { keyframes, css } from "styled-components"
import { IoCart } from "react-icons/io5"
import { filter } from "../../utils/helpers.js"

const Container = styled.div`
  width: 100%;
  height: 44px;
  max-width: 480px;
`

const buttonFilter = filter("button")

const Button = styled(buttonFilter(["isLoading"]))`
  width: 100%;
  height: 44px;
  font-size: 1rem;
  border-radius: 4px;
  letter-spacing: 0.05em;
  color: #fff;
  background-color: #004066;
  transition: background-color 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #002134;
  }

  /* Apply cursor: not-allowed style when loading */
  ${({ isLoading }) =>
    isLoading &&
    css`
      cursor: not-allowed;
      background-color: #002134;
    `}
`

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const LoadingSpinner = styled.div`
  width: 25px;
  height: 25px;
  border-color: #fff;
  border-width: 3px;
  border-left-color: #266aca;
  border-radius: 40px;
  border-style: solid;
  font-size: 0;
  animation: ${rotate} 2s 0.25s linear infinite;
`

export default function AddCart({ title, onClick }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    if (!isLoading) {
      setIsLoading(true)

      // Simulate a 600ms delay before executing the actual onClick action
      setTimeout(() => {
        setIsLoading(false)
        onClick()
      }, 600)
    }
  }

  return (
    <Container>
      <Button isLoading={isLoading} onClick={handleClick}>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <IoCart size={19} style={{ marginRight: "16px" }} />
        )}
        {title}
      </Button>
    </Container>
  )
}
