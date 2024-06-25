import styled, { keyframes } from "styled-components"

/* Shared Styles */
export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(40%);
  }
  to {
    opacity: 1;
    transform: translateX(45%);
  }
`

export const AuthContainerWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 50px;
  flex-direction: column;
  gap: 15px;
  width: 500px;
  margin: 24px auto;
  align-items: center;
  background-color: var(--sc-color-white);
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  border-radius: 20px;

  @media (max-width: 1200px) {
    width: 80%;
  }

  @media (max-width: 1024px) {
    margin: 10% auto;
    width: 70%;
  }

  @media (max-width: 768px) {
    height: 100%;
    margin: 0;
    width: auto;
    border-radius: 0;
  }
`

export const FormContainer = styled.form`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
`

export const EntryWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
  margin: 5px 0;
`

export const EntryContainer = styled.input`
  border: 1px solid var(--sc-color-border-gray);
  border-radius: 0.25rem;
  width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  color: var(--sc-color-text);
  padding-right: 40px;
  transition: border-color 0.3s;

  &:focus + label,
  &:not(:placeholder-shown) + label {
    top: 0px;
    left: 10px;
    font-size: 12px;
    color: var(--sc-color-text);
  }
`

export const Label = styled.label`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: var(--sc-color-text);
  background-color: var(--sc-color-white);
  font-size: 16px;
  pointer-events: none;
  transition: all 0.3s ease;
`

export const HeaderText = styled.h1`
  font-weight: 800;
  font-size: 23px;
  padding: 5px;
`

export const InfoButton = styled.button`
  appearance: none;
  border: 0;
  background-color: transparent;
  margin: 5px;
  padding: 5px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:focus .info-icon,
  &:hover .info-icon {
    color: var(--sc-color-white);
    background-color: var(--sc-color-blue);
    transition: all 0.3s;
  }

  .info-icon {
    appearance: none;
    background-color: transparent;
    border: 2px solid var(--sc-color-blue);
    border-radius: 50%;
    width: 17px;
    height: 17px;
    color: var(--sc-color-blue);
    background-color: var(--sc-color-white);
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s;
  }
`

export const InfoTooltip = styled.div`
  position: absolute;
  transform: translateX(45%);
  left: 50%;
  background-color: var(--sc-color-white);
  color: var(--sc-color-text);
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: normal;
  max-width: 250px;
  min-width: 0;
  text-align: left;
  box-shadow: rgba(156, 156, 156, 0.7) 0px 0px 6px;
  animation: ${fadeIn} 0.3s ease;
  border: 1px solid transparent;

  &:after {
    content: "";
    position: absolute;
    width: 10px;
    height: 10px;
    border: 1px solid transparent;
    background-color: var(--sc-color-white);
    z-index: -2;
    left: -6px;
    top: 50%;
    margin-top: -6px;
    transform: rotate(135deg);
    filter: drop-shadow(rgba(0, 0, 0, 0.2) 2px 0px 1px);
  }

  &:before {
    content: "";
    display: block;
    background-color: inherit;
    position: absolute;
    z-index: -1;
    width: 10px;
    height: 18px;
    left: 0;
    top: 50%;
    margin-top: -9px;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
  }

  @media (max-width: 768px) {
    left: 0;
  }
`

export const ResetText = styled.button`
  display: inline-block;
  margin-top: 5px;
  padding: 5px;
  align-content: baseline;
  font-weight: 500;
  font-size: 13px;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    text-decoration: underline;
  }
`

export const AuthBtn = styled.button`
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: var(--sc-color-white);
  border: medium;
  font-weight: bold;
  min-height: 44px;
  padding: 0px 16px;
  width: 100%;
  text-align: center;
  background-color: var(--sc-color-blue);
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--sc-color-dark-blue);
  }

  &:active {
    background-color: var(--sc-color-dark-blue);
  }

  &:focus-visible {
    background-color: var(--sc-color-dark-blue);
  }
`
export const KeepSignInWrapper = styled.div`
  display: flex;
  padding: 5px 0;
`

export const TooltipContainer = styled.div`
  display: inline-flex;
  align-items: center;
  margin-right: 10px;
`

export const ErrorMessage = styled.div`
  display: flex;
  color: #d32f2f;
  font-size: 14px;
  padding: 10px 0;
`

export const EntryBtnWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
`

export const ValidationMessage = styled.div`
  color: #d32f2f;
  font-size: 12px;
`

export const PolicyContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  font-size: 12px;
  color: var(--sc-color-text-light-gray);
  margin: 10px 0px 0px;
  align-items: center;

  a {
    color: var(--sc-color-link-blue);
    width: fit-content;
  }

  a:hover {
    text-decoration: underline;
  }

  a:focus-visible {
    text-decoration: underline;
  }
`

export const LogoBox = styled.div`
  display: flex;
  align-items: center;
  width: 80px;

  @media (max-width: 768px) {
    max-width: 75px;
    width: auto;
  }
`

export const invalidStyle = {
  borderColor: "#D32F2F",
  color: "#D32F2F",
} /* This one has to remain an object */
