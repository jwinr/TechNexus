import React from "react"
import StarSymbol from "../../public/images/icons/star.svg"

function FilledStar() {
  return (
    <svg className="c-star active" width="32" height="32" viewBox="0 0 32 32">
      <defs>
        <StarSymbol />
      </defs>
      {/* Filled star */}
      <use xlinkHref="#star" fill="#fed94b"></use>
      {/* Outline */}
      <use
        xlinkHref="#star"
        fill="none"
        stroke="DarkGoldenRod"
        strokeWidth="2"
      ></use>
    </svg>
  )
}

export default FilledStar
