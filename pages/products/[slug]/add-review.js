import React, { useContext, useState, useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import Link from "next/link"
import styled from "styled-components"
import { UserContext } from "../../../context/UserContext"
import LoaderDots from "../../../components/loaders/LoaderDots"

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
  color: var(--sc-color-red-dark);
  font-size: 14px;
`

const ProductDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`

const ProductImage = styled.div`
  width: 100%;

  @media (min-width: 768px) {
    width: 33.33%;
  }

  img {
    width: 100%;
    height: auto;
  }
`

const ProductInfo = styled.div`
  flex: 1;

  .product-info {
    h4 {
      font-size: 16px;
      margin: 0;
    }

    p {
      font-size: 14px;
      color: #555;
    }
  }
`

const AddReview = () => {
  const { userAttributes } = useContext(UserContext)
  const router = useRouter()
  const { slug } = router.query
  const [reviewTitle, setReviewTitle] = useState("")
  const [reviewText, setReviewText] = useState("")
  const [rating, setRating] = useState(0)
  const [error, setError] = useState("")
  const [product, setProduct] = useState(null)

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/products/${slug}/add-review`, {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
        }
      } catch (error) {
        console.error("Error fetching product details:", error)
      }
    }

    if (slug) {
      fetchProductDetails()
    }
  }, [slug])

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
          productId: slug,
        }),
      })

      if (response.ok) {
        // Refresh reviews list..
        router.push(`/products/${slug}`)
      } else {
        const errorData = await response.json()
        setError(errorData.error)
      }
    } catch (error) {
      console.error("Error submitting review:", error)
    }
  }

  return (
    <>
      <Head>
        <title>Write Review : TechNexus</title>
        <meta
          property="og:title"
          content="TechNexus - Page Not Found"
          key="title"
        />
        <meta
          name="description"
          content="Page not found. The page you are looking for does not exist."
        />
      </Head>
      <Container>
        {!product ? (
          <LoaderDots />
        ) : (
          <>
            <ProductDetailsContainer>
              <ProductImage>
                <Link href={`/products/${slug}`}>
                  <img src={product.image} alt={product.name} />
                </Link>
              </ProductImage>
              <ProductInfo>
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p>{product.description}</p>
                </div>
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
              </ProductInfo>
            </ProductDetailsContainer>
          </>
        )}
      </Container>
    </>
  )
}

export default AddReview
