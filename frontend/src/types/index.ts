
export interface Card {
    id: string
    title: string
    affirmation: string
    color: number
    x: number
    y: number
    emoji: string
  }
  
export interface Sticker {
id: string
day: string 
x: number 
y: number 
card_id: string | null
}

export interface DragState {
type: "card" | "sticker"
id: string
offsetX: number
offsetY: number
}

export interface BoardData {
cards: Card[]
stickers: Sticker[]
}