/**
 * API service for meter reading submissions
 * Uses AWS Lambda API endpoint
 */

// Get API URL from environment variable
// The Lambda URL already points to the specific function, so we use it directly
const API_ENDPOINT = import.meta.env.VITE_API_URL

/**
 * Get all meter readings from the backend
 * @returns {Promise<Array>} Array of meter reading objects
 * @throws {Error} If the fetch fails
 */
export async function getMeterReadings() {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Check if response is successful (2xx status code)
    if (!response.ok) {
      throw new Error(`Failed to fetch readings with status: ${response.status}`)
    }

    // Parse and return JSON response
    const data = await response.json()
    return data
  } catch (error) {
    // Log error and re-throw for handling by caller
    console.error('Error fetching meter readings:', error)
    throw new Error('Failed to fetch meter readings. Please try again.')
  }
}

/**
 * Submit meter reading data to the backend
 * @param {number} readingValue - The meter reading value
 * @returns {Promise<Object>} The API response
 * @throws {Error} If the submission fails
 */
export async function submitMeterReading(readingValue) {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ readingValue }),
    })

    // Parse response body (may contain error message)
    const data = await response.json()

    // Check if response is successful (2xx status code)
    if (!response.ok) {
      // Server returned an error message in JSON format
      const errorMessage = data.message || data.error || `Submission failed with status: ${response.status}`
      throw new Error(errorMessage)
    }

    // Return success response
    return data
  } catch (error) {
    // Log error and re-throw for handling by caller
    console.error('Error submitting meter reading:', error)

    // If error already has a message, use it; otherwise provide generic message
    if (error.message && !error.message.includes('fetch')) {
      throw error
    }
    throw new Error('Failed to submit meter reading. Please check your connection and try again.')
  }
}
