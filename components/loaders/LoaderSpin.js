import React from "react"
import styled, { keyframes } from "styled-components"
import PropFilter from "../../utils/PropFilter"

const spin = keyframes`
    0% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(360deg);
    }
`

const spinner = keyframes`
    0% {
        stroke-dashoffset: 138.23007675795088;
    }
    100% {
        stroke-dashoffset: 0;
    }
`

const LoaderSpinner = styled(PropFilter("div")(["loading"]))`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${({ loading }) => (loading ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;

  & > div {
    width: 22px;
    height: 22px;
    border-radius: 50%;

    & svg {
      animation: ${spin} 1750ms linear 0s infinite normal none running;
    }

    & circle {
      fill: transparent;
      transform: rotate(-120deg);
      transform-origin: 50% 50%;
      stroke-linecap: round;
      animation: 3500ms linear 0s infinite normal none running ${spinner};
    }
  }
`

const LoaderSpin = ({ loading }) => (
  <LoaderSpinner loading={loading}>
    <div
      style={{
        "--offset": "138.23007675795088",
        width: "24px",
        height: "24px",
      }}
    >
      <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" x="0" y="0">
        <circle
          cx="12"
          cy="12"
          r="11"
          strokeDasharray="69.11503837897544"
          strokeDashoffset="138.23007675795088"
          strokeWidth="2"
          stroke="currentcolor"
        ></circle>
      </svg>
      <slot></slot>
    </div>
  </LoaderSpinner>
)

export default LoaderSpin
