export const confirmPasswordValidator = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return "Passwords don't match"
    }
    return ''
  }
