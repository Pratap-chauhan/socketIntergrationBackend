export default (error) => {
  if (process.env.NODE_ENV === 'development') {
    return {
      message: error.message,
      state: error.originalError && error.originalError.state,
      locations: error.locations,
      path: error.path,
      stack: error.stack ? error.stack.split('\n') : [],
    }
  }
  return {
    message: error.message,
    state: error.originalError && error.originalError.state,
  }
}