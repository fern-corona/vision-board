import type { BoardData, Card, Sticker } from "../types"

const API = "http://localhost:8000" //TODO: remove this


export const fetchBoard = async(): Promise<BoardData> => {
    const res = await fetch(`${API}/board`)
    return res.json()
}

export const saveBoard = async (cards: Card[], stickers: Sticker[]) => {
    await fetch(`${API}/board`, {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({ cards, stickers }),
    })
}

