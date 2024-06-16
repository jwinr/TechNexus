import React from "react"
import styled, { keyframes } from "styled-components"
import { filter } from "../../utils/helpers.js"

const divFilter = filter("div")

const spin = keyframes`
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
`

const LoaderSpin = styled(divFilter(["loading"]))`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${({ loading }) => (loading ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;

  & > div {
    border: 2px solid #ffffff;
    border-top-color: #fff0;
    border-left-color: #fff0;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    animation: ${spin} 0.5s infinite linear;
  }
`

const LoaderBtnSpin = ({ loading }) => (
  <LoaderSpin loading={loading}>
    <div></div>
  </LoaderSpin>
)

export default LoaderBtnSpin
