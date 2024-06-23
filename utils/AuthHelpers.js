export const validateEmailDomain = (email) => {
  const regex = /.+@\S+\.\S+$/
  return regex.test(email)
}

export const validatePassword = (password) => {
  const pattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\^$*.[\]{}()?"!@#%&/\\,><':;|_~`=+\-])[A-Za-z\d\^$*.[\]{}()?"!@#%&/\\,><':;|_~`=+\-]{8,20}$/
  return pattern.test(password)
}

export const validateFirstName = (given_name) => {
  const pattern = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u
  return pattern.test(given_name)
}

export const validateLastName = (family_name) => {
  const pattern = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u
  return pattern.test(family_name)
}

export const handleBlur = (value, validator, setValid) => {
  if (value.trim().length === 0) {
    setValid(true)
  } else {
    setValid(validator(value))
  }
}

/* Allow users to press enter to toggle the password reveal */
export const handleKeyDown = (event, handleSignIn) => {
  if (event.key === "Enter") {
    const activeElement = document.activeElement
    const isPasswordRevealButton =
      activeElement &&
      activeElement.classList.contains("password-reveal-button")

    if (!isPasswordRevealButton) {
      event.preventDefault() // Prevent default form submission
      handleSignIn(event) // Call the sign-in handler
    }
  }
}
