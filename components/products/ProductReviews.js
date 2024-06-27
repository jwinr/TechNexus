import React, { useContext } from "react"
import { useRouter } from "next/router"
import styled from "styled-components"
import VoteButton from "./VoteButton"
import StarRating from "../review-stars/StarRatings"
import { UserContext } from "../../context/UserContext"

const Container = styled.div`
  grid-area: reviews;

  h3 {
    font-size: 19px;
    margin-bottom: 25px;
    color: #000;
  }

  p {
    font-size: 14px;
  }
`

const VoteContainer = styled.div`
  display: flex;
  gap: 10px;
  width: fit-content;
`

const ReviewTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
`

const ReviewText = styled.div`
  font-size: 14px;
`

const WriteReviewButton = styled.button`
  margin-top: 20px;
  padding: 10px;
  background-color: #000;
  color: #fff;
  border: none;
  cursor: pointer;
`

const ProductReviews = ({ reviews, productId }) => {
  const { userAttributes } = useContext(UserContext)
  const router = useRouter()

  const handleVote = async (reviewId, type) => {
    try {
      const response = await fetch("/api/reviews/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({
          reviewId,
          voteType: type,
          cognitoSub: userAttributes.sub,
        }),
      })

      if (response.ok) {
        // Perform additional actions after successful voting, e.g., update state to reflect the vote count...
      } else {
        console.error("Failed to record vote")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleWriteReviewClick = () => {
    router.push(`/products/${productId}/add-review`)
  }

  return (
    <Container>
      {!reviews || reviews.length === 0 ? (
        <p>No reviews available for this product.</p>
      ) : (
        <div className="product-reviews-container">
          <ul className="reviews-list">
            {reviews.map((review, index) => (
              <li key={index} className="review-item">
                <div className="review-content">
                  <div className="review-user">
                    <p>
                      {review.first_name} {review.last_initial}
                    </p>
                  </div>
                  <div className="review-rating">
                    <StarRating reviews={review.rating} />
                  </div>
                  <ReviewTitle>{review.review_title}</ReviewTitle>
                  <ReviewText>{review.review_text}</ReviewText>
                  <div className="review-date">
                    <span>
                      Review Date:{" "}
                      {new Date(review.review_date).toLocaleDateString()}
                    </span>
                  </div>
                  <VoteContainer>
                    <VoteButton
                      reviewId={review.review_id}
                      count={review.upvotes}
                      type="upvote"
                      handleVote={handleVote}
                    />
                    <VoteButton
                      reviewId={review.review_id}
                      count={review.downvotes}
                      type="downvote"
                      handleVote={handleVote}
                    />
                  </VoteContainer>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {userAttributes && (
        <WriteReviewButton onClick={handleWriteReviewClick}>
          Write a review
        </WriteReviewButton>
      )}
    </Container>
  )
}

export default ProductReviews
