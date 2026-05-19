import type { BoardData, Card } from "../types"

const API = "http://localhost:8000" //TODO: remove this


export const fetchBoard = async(): Promise<BoardData> => {
    const res = await fetch(`${API}/board`)
    return res.json()
}

export const saveBoard = async (cards: Card[]) => {
    console.log("Saving board:", JSON.stringify({ cards }, null, 2))  // ← add this
  
    const res = await fetch(`${API}/board`, {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({ cards }),
        
    })
    console.log("Save response status:", res.status)  // ← and this
    const body = await res.json()
    console.log("Save response body:", body)           
}

