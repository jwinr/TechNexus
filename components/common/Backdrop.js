import React from "react"
import styled from "styled-components"

const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -100;
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  backdrop-filter: ${({ isOpen }) => (isOpen ? "blur(3px)" : "blur(0)")};
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out,
    backdrop-filter 0.3s ease-in-out;
`

export default Backdrop
