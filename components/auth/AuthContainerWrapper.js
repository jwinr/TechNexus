import styled from "styled-components"

const AuthContainerWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 50px;
  flex-direction: column;
  gap: 15px;
  width: 500px;
  margin: 48px auto;
  align-items: center;
  background-color: var(--color-main-white);
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  border-radius: 20px;

  @media (max-width: 768px) {
    height: 100%;
    margin: 0;
    width: auto;
    border-radius: 0;
  }
`

export default AuthContainerWrapper
