import React from "react"

export default function AddCart({ title, onClick, full = false }) {
  let classNames =
    "text-md rounded-full font-bold tracking-wider bg-yellow-500 hover:bg-black darktext font-semibold hover:text-white py-2 px-6 border-2 border-transparent hover:border-transparent"

  if (full) {
    classNames = `${classNames} w-full`
  }
  return (
    <button onClick={onClick} className={classNames}>
      <div>{title}</div>
    </button>
  )
}
