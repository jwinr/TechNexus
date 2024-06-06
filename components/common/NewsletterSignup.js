// components/common/NewsletterSignup.js

import React from "react"
import styled from "styled-components"

const NewsletterContainer = styled.div`
  text-align: center;
  padding: 20px;
  background-color: #f5f0e1;
  border-radius: 12px;
`

const NewsletterTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
`

const NewsletterForm = styled.form`
  display: flex;
  justify-content: center;
  gap: 10px;
`

const NewsletterInput = styled.input`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
`

const NewsletterButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #005bb5;
  }
`

const NewsletterSignup = () => {
  return (
    <NewsletterContainer>
      <NewsletterTitle>Stay Updated</NewsletterTitle>
      <NewsletterForm>
        <NewsletterInput type="email" placeholder="Enter your email" />
        <NewsletterButton>Subscribe</NewsletterButton>
      </NewsletterForm>
    </NewsletterContainer>
  )
}

export default NewsletterSignup
