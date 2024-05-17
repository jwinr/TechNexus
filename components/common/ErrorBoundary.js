// ErrorBoundary.js
import React, { Component } from "react"
import styled from "styled-components"

const ErrorWrapper = styled.div`
  display: flex;
  align-content: center;
`

const ErrorMessage = styled.h1`
  font-size: 42px;
  font-weight: 800;
`

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by error boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorWrapper>
          <ErrorMessage>
            Oops! Something went wrong! Please try again.
          </ErrorMessage>
        </ErrorWrapper>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
