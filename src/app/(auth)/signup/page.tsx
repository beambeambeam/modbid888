export default function SignUp() {
  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input type="text" name="email" id="email" />

      <label htmlFor="password">Password:</label>
      <input type="password" name="password" id="password" />

      <label htmlFor="confirm-password">Confirm Password:</label>
      <input type="password" name="confirm password" id="confirm-password" />

      <button type="submit">Sign Up</button>
    </form>
  )
}
