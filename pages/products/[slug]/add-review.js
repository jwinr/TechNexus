import React, { useContext, useState } from "react"
import { useRouter } from "next/router"
import styled from "styled-components"
import { UserContext } from "../../../context/UserContext"

const Container = styled.div`
  padding: 20px;

  h3 {
    font-size: 19px;
    margin-bottom: 25px;
    color: #000;
  }

  p {
    font-size: 14px;
  }
`

const ReviewForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;

  input,
  textarea {
    width: 100%;
    padding: 10px;
    font-size: 14px;
  }

  button {
    padding: 10px;
    background-color: #000;
    color: #fff;
    border: none;
    cursor: pointer;
  }
`

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
`

const AddReview = () => {
  const { userAttributes } = useContext(UserContext)
  const router = useRouter()
  const { slug } = router.query
  const [reviewTitle, setReviewTitle] = useState("")
  const [reviewText, setReviewText] = useState("")
  const [rating, setRating] = useState(0)
  const [error, setError] = useState("")

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    setError("") // Reset error message
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({
          title: reviewTitle,
          text: reviewText,
          rating,
          cognitoSub: userAttributes.sub,
          productId: slug, // Ensure productId is being sent
        }),
      })

      if (response.ok) {
        // Optionally, refresh reviews list or handle UI update
        router.push(`/products/${slug}`)
      } else {
        const errorData = await response.json()
        setError(errorData.error)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <Container>
      <h3>Add Your Review</h3>
      <ReviewForm onSubmit={handleReviewSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <input
          type="text"
          placeholder="Review Title"
          value={reviewTitle}
          onChange={(e) => setReviewTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Review Text"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          min="1"
          max="5"
          required
        />
        <button type="submit">Submit Review</button>
      </ReviewForm>
    </Container>
  )
}

export default AddReview
