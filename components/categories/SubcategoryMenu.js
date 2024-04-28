import React from "react"
import { Link } from "next/link"

const SubcategoryMenu = ({ subcategories }) => (
  <ul className="subcategory-menu">
    {subcategories.map((subcategory, index) => (
      <li key={index}>
        <Link href={`/categories/${subcategory.slug}`}>{subcategory.name}</Link>
      </li>
    ))}
  </ul>
)

export default SubcategoryMenu
