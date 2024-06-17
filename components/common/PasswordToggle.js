import React, { useState } from "react"
import styled from "styled-components"

const Container = styled.button`
  position: absolute;
  right: 10px;
  padding: 5px;
  border: none;
  background: transparent;
  cursor: pointer;
`

const EyeIcon = styled.svg`
  width: 24px;
  height: 24px;
  .eye-line {
    fill: var(--sc-color-text);
  }
  .eye-line2 {
    fill: none;
    stroke: var(--sc-color-text);
    stroke-linecap: round;
    stroke-miterlimit: 10;
    stroke-dasharray: 20px 29px;
    stroke-dashoffset: ${(props) => (props.clicked ? "0px" : "20px")};
    transition: stroke-dashoffset 0.3s ease-in-out;
  }
`

const PasswordToggle = ({ onClick, clicked }) => (
  <Container onClick={onClick}>
    <EyeIcon
      clicked={clicked}
      version="1.1"
      id="eye-icon"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="2 2 16 12"
      xmlSpace="preserve"
    >
      <g>
        <path
          className="eye-line"
          d="M17,7.5c-0.8-1-3.6-4.2-7-4.2c-3.5,0-6.3,3.2-7,4.2c-0.2,0.3-0.2,0.7,0,1c0.8,1,3.6,4.2,7,4.2s6.3-3.2,7-4.2
      C17.2,8.2,17.2,7.8,17,7.5z M10,11.7c-2.9,0-5.5-2.8-6.2-3.7C4.5,7.2,7.1,4.3,10,4.3s5.5,2.8,6.2,3.7C15.5,8.8,12.9,11.7,10,11.7z"
        />
        <path
          className="eye-line"
          d="M10,5.2C8.4,5.2,7.2,6.4,7.2,8s1.3,2.8,2.8,2.8s2.8-1.3,2.8-2.8S11.6,5.2,10,5.2z M10,9.9C9,9.9,8.1,9,8.1,8
      S9,6.1,10,6.1S11.9,7,11.9,8S11,9.9,10,9.9z"
        />
      </g>
      <line className="eye-line2" x1="4.4" y1="12.5" x2="15.7" y2="3.2" />
    </EyeIcon>
  </Container>
)

export default PasswordToggle
