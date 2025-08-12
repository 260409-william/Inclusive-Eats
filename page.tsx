
"use client" // This page needs to be a client component to manage state

import { useState, useEffect } from "react"
import TotemAccessible from "@/components/totem-accessible"
import StartScreen from "@/components/start-screen"

export default function HomePage() {
  const [showTotem, setShowTotem] = useState(false)

  useEffect(() => {
    const initVLibras = () => {
      // Verificar se já existe uma instância do VLibras
      if (document.querySelector("[vw]")) {
        return
      }

      // Criar a div do VLibras
      const vLibrasDiv = document.createElement("div")
      vLibrasDiv.setAttribute("vw", "")
      vLibrasDiv.className = "enabled"

      const accessButton = document.createElement("div")
      accessButton.setAttribute("vw-access-button", "")
      accessButton.className = "active"

      const pluginWrapper = document.createElement("div")
      pluginWrapper.setAttribute("vw-plugin-wrapper", "")

      const topWrapper = document.createElement("div")
      topWrapper.className = "vw-plugin-top-wrapper"

      pluginWrapper.appendChild(topWrapper)
      vLibrasDiv.appendChild(accessButton)
      vLibrasDiv.appendChild(pluginWrapper)
      document.body.appendChild(vLibrasDiv)

      // Carregar o script do VLibras se ainda não foi carregado
      if (!document.querySelector('script[src*="vlibras-plugin.js"]')) {
        const script = document.createElement("script")
        script.src = "https://vlibras.gov.br/app/vlibras-plugin.js"
        script.async = true

        script.onload = () => {
          console.log("VLibras script carregado")
          // Aguardar um pouco para garantir que o script foi processado
          setTimeout(() => {
            try {
              if (typeof window !== "undefined" && (window as any).VLibras) {
                console.log("Inicializando VLibras Widget")
                ;new (window as any).VLibras.Widget("https://vlibras.gov.br/app")
                console.log("VLibras Widget inicializado com sucesso")
              } else {
                console.error("VLibras não encontrado no window")
              }
            } catch (error) {
              console.error("Erro ao inicializar VLibras:", error)
            }
          }, 2000)
        }

        script.onerror = () => {
          console.error("Erro ao carregar script do VLibras")
        }

        document.head.appendChild(script)
      }
    }

    // Inicializar VLibras quando a página carregar
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initVLibras)
    } else {
      initVLibras()
    }

    // Cleanup não necessário pois queremos manter o VLibras ativo
  }, [])

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 font-sans text-white relative"
      style={{
        background: `url('/food-background.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 w-full max-w-6xl">
        {showTotem ? <TotemAccessible /> : <StartScreen onStart={() => setShowTotem(true)} />}
      </div>
    </div>
  )
}
