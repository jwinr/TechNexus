import styled from "styled-components"

const AuthContainerWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 30px 30px 30px 30px;
  flex-direction: column;
  gap: 15px;
  width: 500px;
  margin: 24px auto;
  align-items: center;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`

export default AuthContainerWrapper
