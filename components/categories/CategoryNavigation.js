import React from "react"
import styled from "styled-components"
import Link from "next/link"
import categoriesConfig from "../../utils/categoriesConfig"

const NavContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around; // Space the categories apart evenly
  width: 100%;
  gap: 20px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;

  &.in-view {
    opacity: 1;
    transform: translateY(0);
  }
`

const NavIcon = styled.div`
  height: 150px;
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  overflow: hidden;
  background-color: var(--sc-color-white);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  div {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  svg {
    max-width: 125px;
    width: auto;
    height: 100px;
  }
`

const NavItem = styled.div`
  text-align: center;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px;
  font-weight: 500;
  background-color: transparent;
  max-width: 175px; // Setting a max width so the icons are evenly distributed across the available space
`

const NavTitle = styled.div`
  font-size: 16px;
  margin-top: 5px;
`

const NavLink = styled(Link)`
  text-decoration: none;

  &:hover ${NavIcon} {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`

const FallbackIcon = styled.div`
  background-color: #f0f0f0;
  color: #888;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const CategoryNavigation = React.forwardRef((props, ref) => {
  return (
    <NavContainer ref={ref} className={props.className}>
      {categoriesConfig.map((category) => (
        <NavLink
          key={category.id}
          href={`/categories/${category.slug}`}
          passHref
        >
          <NavItem>
            <NavIcon>
              {category.icon ? (
                React.createElement(category.icon)
              ) : (
                <FallbackIcon>?</FallbackIcon>
              )}
            </NavIcon>
            <NavTitle>{category.name}</NavTitle>
          </NavItem>
        </NavLink>
      ))}
    </NavContainer>
  )
})

export default CategoryNavigation
