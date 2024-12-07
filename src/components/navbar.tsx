import Logout from "./sign-out"
import ModeTogger from "./toggle-mode"
import { Separator } from "./ui/separator"

function Navbar() {
  return (
    <div className="h-fit">
      <div className="h-16 flex items-center w-full justify-between px-11">
        <h1 className="font-alagard text-3xl">Modbid888</h1>
        <div className="flex flex-row gap-4">
          <div className="w-fit flex flex-row font-alagard text-xl items-center">
            <p>admin</p>
            <p>#</p>
            <p>1</p>
          </div>
          <Logout />
          <ModeTogger />
        </div>
      </div>
      <Separator />
    </div>
  )
}

export default Navbar
