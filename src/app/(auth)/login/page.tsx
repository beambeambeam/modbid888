export default function Login() {
  return (
    <form>
      <label htmlFor="email">Email</label>
      <input type="text" name="email" />
      <label htmlFor="password">Password</label>
      <input type="password" name="password" />
      <button type="submit">Sign Up</button>
    </form>
  )
}
