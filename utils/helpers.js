import React from "react"

// Helper function to filter out unwanted props and prevent the "unknown prop on DOM element" console warning

/* Can be used like this;
const divFilter = filter("div")
const StyledComponent = styled(divFilter(["loading"]))`
where 'loading' is replaced with the prop name.
*/

const e = React.createElement

const filter = (tag) => (whitelist) =>
  React.forwardRef(({ children, ...props }, ref) => {
    whitelist.forEach((prop) => delete props[prop])
    return e(tag, { ref, ...props }, children)
  })

export { filter }
