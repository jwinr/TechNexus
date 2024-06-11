import React, { useState } from "react"
import styled, { keyframes } from "styled-components"
import { LiaThumbsUpSolid, LiaThumbsDownSolid } from "react-icons/lia"

const Button = styled.button`
  display: flex;
  align-items: center;
  padding: 5px 5px;
  border: none;
  border-radius: 4px;
  background-color: #f0f0f0;
  color: var(--sc-color-text);
  font-size: 14px;
  cursor: pointer;
  position: relative;
  justify-content: space-evenly;
  overflow: hidden;
  width: 50px;

  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #e0e0e0;
  }
`

const ThumbsIcon = styled.p`
  font-size: 22px;

  transition: transform 0.3s;
  &.animate {
    animation: ${keyframes`
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.3);
      }
      100% {
        transform: scale(1);
      }
    `} 0.3s;
  }
`

const Count = styled.p`
  font-weight: 600;
`

const VoteButton = ({ reviewId, count, type, handleVote }) => {
  const [voted, setVoted] = useState(false)
  const [voteCount, setVoteCount] = useState(count)
  const [animate, setAnimate] = useState(false)

  const handleClick = async () => {
    if (!voted) {
      setVoted(true)
      setVoteCount(voteCount + 1) // Update the vote on the client-side immediately
      setAnimate(true)
      await handleVote(reviewId, type) // then do the API call..
      setTimeout(() => {
        setAnimate(false)
      }, 300) // Delay to let the animation play
    } else {
      // If the user already voted.. (temporarily allowing for testing purposes)
      setVoted(true)
      setVoteCount(voteCount + 1)
      setAnimate(true)
      await handleVote(reviewId, type)
      setTimeout(() => {
        setAnimate(false)
      }, 300)
    }
  }

  return (
    <Button onClick={handleClick}>
      <ThumbsIcon className={animate ? "animate" : ""}>
        {type === "upvote" ? <LiaThumbsUpSolid /> : <LiaThumbsDownSolid />}
      </ThumbsIcon>
      <Count>{voteCount}</Count>
    </Button>
  )
}

export default VoteButton
