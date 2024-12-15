import AnimatedShinyText from "~/components/ui/animated-shiny-text"

function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center text-4xl font-alagard">
      <AnimatedShinyText>
        Please wait while we loading your game!
      </AnimatedShinyText>
    </div>
  )
}
export default Loading
