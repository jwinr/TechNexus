import pool from "./db.js"

export default async (req, res) => {
  try {
    const categoriesQuery = `
      SELECT category_id, parent_category, slug, name, icon
      FROM categories;
    `
    const categoriesQueryResult = await pool.query(categoriesQuery)
    const rows = categoriesQueryResult.rows

    if (rows.length === 0) {
      return res.status(404).json({ error: "Categories not found" })
    }

    // Organize categories into a hierarchical structure
    const categoriesData = organizeCategories(rows)

    res.json(categoriesData)
  } catch (error) {
    console.error("Error fetching category data:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

function organizeCategories(rows) {
  const categoriesMap = new Map() // Using a Map for better key handling

  // Iterate through the rows and create a map of categories
  rows.forEach((row) => {
    const category = {
      id: row.category_id,
      slug: row.slug,
      name: row.name,
      icon: row.icon,
      subCategories: [], // Initialize subcategories array
    }

    if (row.parent_category === null) {
      // If the category is a main category
      category.subCategories = [] // Initialize subcategories array for main categories
      category.parent_category = null // Define parent as null for main categories
    } else {
      // If the category is a subcategory
      const parentCategory = categoriesMap.get(row.parent_category)
      if (parentCategory) {
        // Check if the parent category exists
        parentCategory.subCategories.push(category) // Add subcategory to its parent's subcategories
      }
      category.parent_category = row.parent_category // Assign the parent ID to the category
    }
    categoriesMap.set(row.category_id, category) // Add category to the map
  })

  // Sort the main categories and their subcategories by ID
  const allCategories = Array.from(categoriesMap.values())
    .filter((category) => category.parent_category === null)
    .sort((a, b) => a.id - b.id)

  allCategories.forEach((mainCategory) => {
    mainCategory.subCategories.sort((a, b) => a.id - b.id)
  })

  return allCategories
}
