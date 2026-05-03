
export interface Card {
    stickers: Sticker[]
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
status: "none" | "complete" | "incomplete" 
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

export interface InsightsResponse {
  insights: {
    card_title: string
    emoji: string
    days_count: number
    percentage: number
    message: string
  }[]
  total_days_tracked: number
  unassigned_days: string[]
  streak_message: string
}

export interface ColorScheme {
  bg: string
  border: string
  text: string
}


