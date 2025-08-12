declare global {
  interface Window {
    VLibras: {
      Widget: new (url: string) => void
    }
  }
}

export {}
