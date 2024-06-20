import React from "react"

function HalfFilledStar({ fractionalPart }) {
  const clipWidth = 34 * fractionalPart // Calculate the width of the clip path based on the fractional part

  return (
    <svg className="c-star-h active" width="32" height="32" viewBox="0 0 32 32">
      <defs>
        <mask id="half-mask">
          <rect x="0" y="-2" width="34" height="34" fill="white" />
        </mask>
        <clipPath id="half-clip">
          <rect x="0" y="0" width={clipWidth} height="32" />
        </clipPath>
      </defs>
      {/* Filled star */}
      <use xlinkHref="#star" mask="url(#half-mask)" fill="#fed94b" />
      {/* Outline */}
      <use
        xlinkHref="#star"
        fill="none"
        clipPath="url(#half-clip)"
        stroke="DarkGoldenRod"
        strokeWidth="2"
      />
    </svg>
  )
}

export default HalfFilledStar
