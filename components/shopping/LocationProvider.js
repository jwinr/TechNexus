import axios from "axios"

const LocationProvider = async () => {
  try {
    const response = await axios.get("https://ipinfo.io/json?token=") // Token temporarily removed for dev purposes
    console.log(response)
    return response.data
  } catch (error) {
    //console.error("Error fetching user location:", error) // Temporarily disabled or else it will throw false-positives
    return null
  }
}

export default LocationProvider
