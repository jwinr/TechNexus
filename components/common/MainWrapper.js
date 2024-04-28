import React from "react"
import styled from "styled-components"

const MainWrapperCom = styled.main`
  max-width: 1440px;
  margin: 0 auto;
  width: calc(100% - 0px);
`

function MainWrapper({ children }) {
  return <MainWrapperCom>{children}</MainWrapperCom>
}

export default MainWrapper
