"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  SandwichIcon as Hamburger,
  GlassWater,
  Salad,
  Leaf,
  Flame,
  Sandwich,
  Coffee,
  Pizza,
  Trash2,
  Mic,
  Palette,
  Hand,
  Utensils,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MenuItemType {
  id: string
  name: string
  price: number
  icon: React.ElementType
  colorClasses: string // Original gradient classes
  librasSvgFill: string
}

interface CartItem {
  name: string
  price: number
}

const menuItems: Record<string, MenuItemType[]> = {
  hamburgers: [
    {
      id: "classic-burger",
      name: "Hambúrguer Clássico (Carne, Alface, Tomate)",
      price: 20.0,
      icon: Hamburger,
      colorClasses: "from-red-500 to-orange-500",
      librasSvgFill: "#ff8e53",
    },
    {
      id: "double-burger",
      name: "Hambúrguer Duplo (2 Carnes, Queijo, Maionese)",
      price: 28.0,
      icon: Hamburger,
      colorClasses: "from-red-500 to-orange-500",
      librasSvgFill: "#ff9f43",
    },
    {
      id: "vegetarian-burger",
      name: "Vegetariano (Grão-de-Bico, Vegetais)",
      price: 22.0,
      icon: Leaf,
      colorClasses: "from-red-500 to-orange-500",
      librasSvgFill: "#51cf66",
    },
    {
      id: "spicy-burger",
      name: "Picante (Carne, Pimenta, Cheddar)",
      price: 24.0,
      icon: Flame,
      colorClasses: "from-red-500 to-orange-500",
      librasSvgFill: "#ff4500",
    },
    {
      id: "chicken-burger",
      name: "Hambúrguer de Frango Grelhado",
      price: 25.0,
      icon: Sandwich,
      colorClasses: "from-yellow-500 to-orange-500",
      librasSvgFill: "#ffc107",
    },
    {
      id: "gourmet-burger",
      name: "Hambúrguer Gourmet",
      price: 32.0,
      icon: Hamburger,
      colorClasses: "from-orange-500 to-red-500",
      librasSvgFill: "#9c27b0",
    },
  ],
  drinks: [
    {
      id: "soda",
      name: "Refrigerante",
      price: 8.0,
      icon: GlassWater,
      colorClasses: "from-yellow-500 to-orange-500",
      librasSvgFill: "#74c0fc",
    },
    {
      id: "natural-juice",
      name: "Suco Natural",
      price: 10.0,
      icon: Coffee,
      colorClasses: "from-yellow-500 to-orange-500",
      librasSvgFill: "#ffd43b",
    },
    {
      id: "water",
      name: "Água Mineral",
      price: 5.0,
      icon: GlassWater,
      colorClasses: "from-yellow-400 to-orange-400",
      librasSvgFill: "#a0aec0",
    },
    {
      id: "iced-tea",
      name: "Chá Gelado",
      price: 7.0,
      icon: Coffee,
      colorClasses: "from-yellow-500 to-orange-500",
      librasSvgFill: "#4caf50",
    },
  ],
  sides: [
    {
      id: "fries",
      name: "Batata Frita",
      price: 12.0,
      icon: Salad,
      colorClasses: "from-orange-500 to-red-500",
      librasSvgFill: "#82c91e",
    },
    {
      id: "onion-rings",
      name: "Onion Rings",
      price: 14.0,
      icon: Salad,
      colorClasses: "from-orange-500 to-red-500",
      librasSvgFill: "#ffb703",
    },
    {
      id: "caesar-salad",
      name: "Salada Caesar",
      price: 18.0,
      icon: Salad,
      colorClasses: "from-yellow-500 to-orange-500",
      librasSvgFill: "#cddc39",
    },
    {
      id: "chicken-nuggets",
      name: "Nuggets de Frango (6 unidades)",
      price: 15.0,
      icon: Pizza,
      colorClasses: "from-orange-500 to-yellow-500",
      librasSvgFill: "#ff9800",
    },
  ],
}

const tabNames: Record<string, string> = {
  hamburgers: "Hambúrgueres",
  drinks: "Bebidas",
  sides: "Acompanhamentos",
}

export default function TotemAccessible() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [total, setTotal] = useState<number>(0)
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true)
  const [isDicromacyModeEnabled, setIsDicromacyModeEnabled] = useState<boolean>(false)
  const [isVLibrasEnabled, setIsVLibrasEnabled] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("hamburgers")
  const [showPaymentScreen, setShowPaymentScreen] = useState<boolean>(false)
  const [showConfirmationScreen, setShowConfirmationScreen] = useState<boolean>(false)
  const [orderNumber, setOrderNumber] = useState<string>("")
  const [currentSpeech, setCurrentSpeech] = useState<SpeechSynthesisUtterance | null>(null)

  const speak = useCallback(
    (text: string) => {
      if (!isVoiceEnabled) return
      if (currentSpeech) window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "pt-BR"
      window.speechSynthesis.speak(utterance)
      setCurrentSpeech(utterance)
    },
    [isVoiceEnabled, currentSpeech],
  )

  useEffect(() => {
    setTotal(cart.reduce((sum, item) => sum + item.price, 0))
  }, [cart])

  const handleAddItem = (item: MenuItemType) => {
    setCart((prevCart) => [...prevCart, { name: item.name, price: item.price }])
    speak(`Adicionado ${item.name} ao carrinho`)
  }

  const handleRemoveItem = (indexToRemove: number) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((_, index) => index !== indexToRemove)
      speak(`Item ${prevCart[indexToRemove].name} removido do carrinho`)
      return newCart
    })
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    speak(`${tabNames[tabId]} selecionado`)
  }

  const handleProceedToPayment = () => {
    if (cart.length === 0) {
      speak("O carrinho está vazio")
      return
    }
    setShowPaymentScreen(true)
    speak("Tela de pagamento")
  }

  const handlePayment = (method: "cash" | "card") => {
    setShowPaymentScreen(false)
    const newOrderNumber = `PED-${Math.floor(Math.random() * 90000) + 10000}`
    setOrderNumber(newOrderNumber)
    setShowConfirmationScreen(true)
    speak(
      `Pagamento com ${method === "cash" ? "dinheiro" : "cartão"} confirmado. Aguarde seu pedido, número ${newOrderNumber.split("-").join(" ")}.`,
    )
  }

  const handleCancelPayment = () => {
    setShowPaymentScreen(false)
    speak("Pagamento cancelado")
  }

  const handleReturnToMenu = () => {
    setShowConfirmationScreen(false)
    setCart([])
    setTotal(0)
    setOrderNumber("")
    speak("Voltando ao menu")
  }

  const getDicromacyColorClasses = (originalColorClasses: string, type: "tab" | "item", tabId?: string) => {
    if (!isDicromacyModeEnabled) {
      return `bg-gradient-to-r ${originalColorClasses}`
    }

    if (type === "tab") {
      if (tabId === "hamburgers") return "bg-blue-700 text-white border-2 border-white"
      if (tabId === "drinks") return "bg-yellow-600 text-black border-2 border-black"
      if (tabId === "sides") return "bg-purple-700 text-white border-2 border-white"
      return "bg-gray-600 text-white border border-gray-400"
    } else {
      if (
        originalColorClasses.includes("from-red-400") ||
        originalColorClasses.includes("from-yellow-400") ||
        originalColorClasses.includes("from-orange-400") ||
        originalColorClasses.includes("from-purple-400")
      ) {
        return "bg-blue-600 text-white border-2 border-blue-800"
      }
      if (
        originalColorClasses.includes("from-blue-400") ||
        originalColorClasses.includes("from-gray-400") ||
        originalColorClasses.includes("from-green-400") ||
        originalColorClasses.includes("from-teal-400")
      ) {
        return "bg-yellow-500 text-black border-2 border-yellow-700"
      }
      if (originalColorClasses.includes("from-green-400") || originalColorClasses.includes("from-lime-400")) {
        return "bg-purple-600 text-white border-2 border-purple-800"
      }
      return "bg-gray-600 text-white border border-gray-400"
    }
  }

  const toggleVLibras = () => {
    setIsVLibrasEnabled((prev) => {
      const newState = !prev

      if (newState) {
        // Remove any existing VLibras elements first
        const existingVLibras = document.querySelector("[vw]")
        if (existingVLibras) existingVLibras.remove()

        // Create simple VLibras div structure
        const vLibrasDiv = document.createElement("div")
        vLibrasDiv.setAttribute("vw", "")
        vLibrasDiv.className = "enabled"

        const accessButton = document.createElement("div")
        accessButton.setAttribute("vw-access-button", "")
        accessButton.className = "active"

        const pluginWrapper = document.createElement("div")
        pluginWrapper.setAttribute("vw-plugin-wrapper", "")

        vLibrasDiv.appendChild(accessButton)
        vLibrasDiv.appendChild(pluginWrapper)
        document.body.appendChild(vLibrasDiv)

        // Load and initialize VLibras
        const loadVLibras = () => {
          if (!document.getElementById("vlibras-script")) {
            const script = document.createElement("script")
            script.id = "vlibras-script"
            script.src = "https://vlibras.gov.br/app/vlibras-plugin.js"
            script.onload = () => {
              setTimeout(() => {
                if ((window as any).VLibras) {
                  ;new (window as any).VLibras.Widget("https://vlibras.gov.br/app")

                  // Position in bottom left
                  setTimeout(() => {
                    const button = document.querySelector("[vw-access-button]") as HTMLElement
                    if (button) {
                      button.style.cssText = `
                        position: fixed !important;
                        bottom: 20px !important;
                        left: 20px !important;
                        right: auto !important;
                        z-index: 9999 !important;
                      `
                    }
                  }, 1500)
                }
              }, 1000)
            }
            document.head.appendChild(script)
          } else {
            // Script already exists, just reinitialize
            setTimeout(() => {
              if ((window as any).VLibras) {
                ;new (window as any).VLibras.Widget("https://vlibras.gov.br/app")
              }
            }, 500)
          }
        }

        loadVLibras()
      } else {
        // Remove VLibras when disabled
        const vLibrasDiv = document.querySelector("[vw]")
        if (vLibrasDiv) vLibrasDiv.remove()
      }

      speak(newState ? "VLibras ativado" : "VLibras desativado")
      return newState
    })
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8">
        <h1 className="text-3xl md:text-5xl font-extrabold text-center mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
          inclusiveEats - Faça seu Pedido
        </h1>

        {/* Accessibility Toggles */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 md:mb-8 justify-center">
          <Button
            onClick={() => {
              setIsVoiceEnabled((prev) => !prev)
              speak(isVoiceEnabled ? "Voz desativada" : "Voz ativada")
            }}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-3 rounded-lg shadow-md hover:from-red-600 hover:to-orange-600 text-lg"
          >
            <Mic className="w-5 h-5 mr-2" /> Ativar/Desativar Voz ({isVoiceEnabled ? "On" : "Off"})
          </Button>
          <Button
            onClick={() => {
              setIsDicromacyModeEnabled((prev) => !prev)
              speak(isDicromacyModeEnabled ? "Modo dicromacia desativado" : "Modo dicromacia ativado")
            }}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-3 rounded-lg shadow-md hover:from-red-600 hover:to-orange-600 text-lg"
          >
            <Palette className="w-5 h-5 mr-2" /> Modo Dicromacia ({isDicromacyModeEnabled ? "On" : "Off"})
          </Button>
          <Button
            onClick={toggleVLibras}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-3 rounded-lg shadow-md hover:from-red-600 hover:to-orange-600 text-lg"
          >
            <Hand className="w-5 h-5 mr-2" /> VLibras ({isVLibrasEnabled ? "On" : "Off"})
          </Button>
        </div>

        <div className="flex space-x-2 mb-4">
          {Object.keys(tabNames).map((tabId) => (
            <div
              key={tabId}
              className={cn(
                "px-6 py-3 text-lg font-semibold rounded-t-lg cursor-pointer transition-all duration-300 flex items-center gap-2",
                {
                  "bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900":
                    activeTab === tabId && !isDicromacyModeEnabled,
                  "bg-gray-700 hover:bg-gray-600 text-white": activeTab !== tabId && !isDicromacyModeEnabled,
                },
                isDicromacyModeEnabled && activeTab === tabId && getDicromacyColorClasses("", "tab", tabId),
                isDicromacyModeEnabled && activeTab !== tabId && "bg-gray-700 hover:bg-gray-600 text-white",
              )}
              onClick={() => handleTabChange(tabId)}
              onMouseEnter={() => isVoiceEnabled && speak(tabNames[tabId])}
            >
              {tabId === "hamburgers" && <Hamburger className="w-6 h-6" />}
              {tabId === "drinks" && <GlassWater className="w-6 h-6" />}
              {tabId === "sides" && <Salad className="w-6 h-6" />}
              {tabNames[tabId]}
            </div>
          ))}
        </div>

        {Object.keys(menuItems).map((tabId) => (
          <div
            key={tabId}
            id={tabId}
            className={cn("p-6 bg-white text-gray-800 rounded-b-2xl shadow-inner", {
              block: activeTab === tabId,
              hidden: activeTab !== tabId,
            })}
          >
            {menuItems[tabId].map((item) => (
              <div
                key={item.id}
                className={cn(
                  "p-5 rounded-lg shadow-md flex items-center justify-between transform transition-all hover:scale-105 cursor-pointer mb-4 text-2xl h-[100px]",
                  getDicromacyColorClasses(item.colorClasses, "item"),
                  isDicromacyModeEnabled ? "text-white" : "text-gray-800",
                )}
                onClick={() => handleAddItem(item)}
                onMouseEnter={() =>
                  isVoiceEnabled && speak(`${item.name}, ${item.price.toFixed(2).replace(".", ",")} reais`)
                }
              >
                <span className="flex items-center gap-2">
                  <item.icon className="w-8 h-8" />
                  {item.name}
                </span>
                <span className="font-bold text-3xl">R$ {item.price.toFixed(2).replace(".", ",")}</span>
              </div>
            ))}
          </div>
        ))}

        <div className="cart-container bg-gray-800 bg-opacity-80 p-6 rounded-xl mt-6">
          <h2 className="text-3xl font-semibold mb-4 flex items-center gap-2">
            <Utensils className="w-8 h-8" /> Carrinho
          </h2>
          <ul id="cart" className="list-disc pl-6 text-lg text-white">
            {cart.length === 0 ? (
              <li>Nenhum item no carrinho.</li>
            ) : (
              cart.map((item, index) => (
                <li key={index} className="flex items-center justify-between mb-2">
                  <span>
                    {item.name} - R$ {item.price.toFixed(2).replace(".", ",")}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(index)}
                    aria-label={`Remover ${item.name} do carrinho`}
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </li>
              ))
            )}
          </ul>
          <p className="text-2xl font-bold mt-4">
            Total: R$ <span id="total">{total.toFixed(2).replace(".", ",")}</span>
          </p>
          <Button
            onClick={handleProceedToPayment}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg shadow-md hover:from-orange-600 hover:to-red-600 text-xl mt-6 w-full"
          >
            Finalizar Pedido
          </Button>
        </div>

        {showPaymentScreen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50">
            <div className="bg-white text-gray-800 p-10 rounded-2xl shadow-2xl max-w-md w-full">
              <h2 className="text-3xl font-semibold mb-6">Pagamento (Simulação)</h2>
              <div className="flex flex-col space-y-4">
                <Button
                  onClick={() => handlePayment("cash")}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg shadow-md hover:from-orange-600 hover:to-red-600 text-xl w-full"
                >
                  Pagar com Dinheiro
                </Button>
                <Button
                  onClick={() => handlePayment("card")}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg shadow-md hover:from-orange-600 hover:to-red-600 text-xl w-full"
                >
                  Pagar com Cartão
                </Button>
                <Button
                  onClick={handleCancelPayment}
                  className="bg-gradient-to-r from-red-400 to-pink-500 text-white p-4 rounded-lg shadow-md hover:from-red-500 hover:to-pink-600 text-xl w-full"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        {showConfirmationScreen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50">
            <div className="bg-white text-gray-800 p-10 rounded-2xl shadow-2xl max-w-md w-full text-center">
              <Button
                onClick={handleReturnToMenu}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg shadow-md hover:from-orange-600 hover:to-red-600 text-xl w-full"
              >
                Voltar ao Menu
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
