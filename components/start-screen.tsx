"use client"
import { Button } from "@/components/ui/button"
import { PlayCircle } from "lucide-react"

interface StartScreenProps {
  onStart: () => void
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="container max-w-md mx-auto bg-gray-900 bg-opacity-90 rounded-2xl shadow-2xl p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
      <img
        src="/totem-food-ordering-logo.png"
        alt="Logo do inclusiveEats"
        className="w-32 h-32 mb-6 rounded-full shadow-lg"
      />

      <h1 className="text-5xl font-extrabold mb-8 text-white drop-shadow-2xl">Bem-vindo ao inclusiveEats</h1>
      <p className="text-xl mb-10 text-white drop-shadow-lg">Toque no botão abaixo para iniciar seu pedido.</p>

      <Button
        onClick={onStart}
        className="bg-orange-500 text-white p-6 rounded-lg shadow-lg hover:bg-orange-600 text-2xl font-bold flex items-center gap-3 transition-all duration-300 transform hover:scale-105"
      >
        <PlayCircle className="w-8 h-8" />
        Iniciar Pedido
      </Button>
    </div>
  )
}
