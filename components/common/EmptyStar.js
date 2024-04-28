import React from "react"

function EmptyStar() {
  return (
    <svg className="c-star active" width="32" height="32" viewBox="0 0 32 32">
      <use xlinkHref="#star" fill="none" stroke="grey" strokeWidth="2px" />
    </svg>
  )
}

export default EmptyStar
