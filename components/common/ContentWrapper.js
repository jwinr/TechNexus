import React from "react"
import styled from "styled-components"

const ContentWrapper = styled.div`
  width: calc(100% - 0px);
  margin: 0px auto;
  max-width: 1400px;
  min-height: 100vh;
  background-color: var(--color-bg-light);
`

function Content({ children }) {
  return <ContentWrapper>{children}</ContentWrapper>
}

export default Content
