/**
 * API service for meter reading submissions
 * Uses JSONPlaceholder as a mock backend endpoint
 */

// Mock API endpoint
const API_ENDPOINT = 'https://jsonplaceholder.typicode.com/posts'

/**
 * Submit meter reading data to the backend
 * @param {Object} meterData - The meter reading data to submit
 * @param {string} meterData.meterNumber - The meter number
 * @param {number} meterData.currentReading - The current meter reading
 * @param {string} meterData.readingDate - The date of the reading
 * @returns {Promise<Object>} The API response
 * @throws {Error} If the submission fails
 */
export async function submitMeterReading(meterData) {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(meterData),
    })

    // Check if response is successful (2xx status code)
    if (!response.ok) {
      throw new Error(`Submission failed with status: ${response.status}`)
    }

    // Parse and return JSON response
    const data = await response.json()
    return data
  } catch (error) {
    // Log error and re-throw for handling by caller
    console.error('Error submitting meter reading:', error)
    throw new Error('Failed to submit meter reading. Please try again.')
  }
}
