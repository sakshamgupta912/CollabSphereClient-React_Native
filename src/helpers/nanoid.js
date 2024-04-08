const nanoid = () => {
    // Generate a random number
    const randomNumber = Math.floor(Math.random() * 1000000)
    // Get the current timestamp
    const timestamp = Date.now()
    // Concatenate the timestamp and random number to create the ID
    const uniqueId = `${timestamp}-${randomNumber}`
    return uniqueId
  }

export default nanoid;