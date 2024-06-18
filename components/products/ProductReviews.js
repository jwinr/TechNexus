import React from "react"
import styled from "styled-components"
import VoteButton from "./VoteButton"
import StarRating from "../shopping/StarRatings"

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

const ProductReviews = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <Container>
        <p>No reviews available for this product.</p>
      </Container>
    )
  }

  const handleVote = async (reviewId, type) => {
    try {
      console.log("Voting...")
      console.log(reviewId)
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({ reviewId, voteType: type }),
      })

      if (response.ok) {
        console.log("Vote recorded successfully")
        // Perform additional actions after successful voting..
      } else {
        console.error("Failed to record vote")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
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
  )
}

export default ProductReviews
