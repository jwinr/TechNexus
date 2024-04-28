// authUtils.js

import { useRouter } from "next/router"
import Cookies from "js-cookie"

const signOut = () => {
  // Clear authentication token from local storage or cookies
  localStorage.removeItem("authToken") // If using localStorage
  Cookies.remove("authToken") // If using cookies

  // Redirect the user to the login page
  const router = useRouter()
  router.push("/login")
}

export default signOut
