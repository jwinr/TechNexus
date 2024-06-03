import React from "react"
import styled, { keyframes } from "styled-components"

const waveAnimation = keyframes`
  50% {
    transform: scale(0.9);
  }
`

const CheckboxWrapper = styled.div`
  display: flex;
  * {
    box-sizing: border-box;
  }
  .cbx {
    -webkit-user-select: none;
    user-select: none;
    cursor: pointer;
    padding: 6px 8px;
    border-radius: 6px;
    overflow: hidden;
    transition: all 0.2s ease;
    display: inline-block;
    background: none;
    border: none;
    text-align: left;
  }
  .cbx:focus-visible {
    transition: none;
  }
  .cbx:not(:last-child) {
    margin-right: 6px;
  }
  .cbx:hover {
    background: rgba(0, 119, 255, 0.06);
  }
  .cbx span {
    float: left;
    vertical-align: middle;
    transform: translate3d(0, 0, 0);
  }
  .cbx span:first-child {
    position: relative;
    width: 18px;
    height: 18px;
    border-radius: 4px;
    transform: scale(1);
    border: 1px solid #cccfdb;
    transition: all 0.2s ease;
    box-shadow: 0 1px 1px rgba(0, 16, 75, 0.05);
  }
  .cbx span:first-child svg {
    position: absolute;
    top: 3px;
    left: 2px;
    fill: none;
    stroke: #fff;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 16px;
    stroke-dashoffset: 16px;
    transition: all 0.3s ease;
    transition-delay: 0.1s;
    transform: translate3d(0, 0, 0);
  }
  .cbx span:last-child {
    padding-left: 8px;
    line-height: 18px;
  }
  .inp-cbx {
    position: absolute;
    visibility: hidden;
  }
  .inp-cbx:checked + .cbx span:first-child {
    background: #07f;
    border-color: #07f;
    animation: ${waveAnimation} 0.4s ease;
  }
  .inp-cbx:checked + .cbx span:first-child svg {
    stroke-dashoffset: 0;
  }
  .inline-svg {
    position: absolute;
    width: 0;
    height: 0;
    pointer-events: none;
    user-select: none;
  }
  @media screen and (max-width: 640px) {
    .cbx {
      width: 100%;
      display: inline-block;
    }
  }
`

const Checkbox = ({ id, label, checked = false, onChange }) => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onChange({ target: { checked: !checked } })
    }
  }

  return (
    <CheckboxWrapper>
      <input
        className="inp-cbx"
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-labelledby={`${id}-label`}
      />
      <button
        className="cbx"
        role="checkbox"
        aria-checked={checked}
        id={`${id}-label`}
        onClick={(event) => {
          event.preventDefault()
          onChange({ target: { checked: !checked } })
        }}
        onKeyDown={handleKeyDown}
      >
        <span>
          <svg width="12px" height="10px" viewBox="0 0 12 10">
            <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
          </svg>
        </span>
        <span>{label}</span>
      </button>
    </CheckboxWrapper>
  )
}

export default Checkbox
