import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Link from "next/link"
import Image from "next/image"
import categoriesConfig from "../../utils/categoriesConfig"

const NavContainer = styled.div`
  display: grid;
  grid-area: category-nav; // Wrapping in a container so it can expand and center properly with long titles
  z-index: 200;
`

const NavWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding-bottom: 25px;
  padding-left: 35px;
  padding-right: 35px;
  grid-area: category-nav;
  justify-items: start;
`

const NavItem = styled.div`
  text-align: center;
  text-decoration: none;
  align-items: center;
  display: flex;
  padding: 20px;
  font-weight: 500;
  gap: 40px;

  &:hover {
    text-decoration: underline;
  }
`

const NavIcon = styled.div`
  height: 48px;
  width: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const NavTitle = styled.div`
  font-size: 14px;
`

const CategoryNavigation = () => {
  return (
    <NavContainer>
      <NavWrapper>
        {categoriesConfig.map((category) => (
          <Link key={category.id} href={`/categories/${category.slug}`}>
            <NavItem>
              <NavIcon>
                <Image
                  src={category.icon}
                  width={150}
                  height={150}
                  alt={category.name}
                />
              </NavIcon>
              <NavTitle>{category.name}</NavTitle>
            </NavItem>
          </Link>
        ))}
      </NavWrapper>
    </NavContainer>
  )
}

export default CategoryNavigation
