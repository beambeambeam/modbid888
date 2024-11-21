import Logout from "~/components/sign-out"

import BlackjackPage from "../minigames/blackjack"

const App: React.FC = () => {
  return (
    <div>
      <Logout />
      <h1>Welcome to MiniGames</h1>
      <BlackjackPage />
    </div>
  )
}

export default App
