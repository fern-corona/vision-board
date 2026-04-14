import {useState, useCallback } from "react"
import type { Card, Sticker, DragState } from "../types"
import { saveBoard } from "../api/board"

export const useDrag = () => {
    const [dragging, setDragging] = useState<DragState | null>(null)

    const onMouseDown = useCallback((
        e: React.MouseEvent,
        type: "card" | "sticker",
        id: string
    ) => {
        e.preventDefault()
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        setDragging({
            type, 
            id, 
            offsetX: e.clientX - rect.left, 
            offsetY: e.clientY - rect.top
        })
    }, [])


    const onMouseMove = useCallback((
        e: MouseEvent, 
        boardRef: React.RefObject<HTMLDivElement | null>, 
        cards: Card[], 
        stickers: Sticker[], 
        setCards: React.Dispatch<React.SetStateAction<Card[]>>, 
        setStickers: React.Dispatch<React.SetStateAction<Sticker[]>>
    ) => {
        if (!dragging || !boardRef.current) return 
        const board = boardRef.current.getBoundingClientRect()
        const x = e.clientX - board.left - dragging.offsetX
        const y = e.clientY - board.top - dragging.offsetY

        if (dragging.type === "card" && cards != null) {
            const card = cards.find(c => c.id === dragging.id)
            if (!card) return 
            
            const delta_x = x - card.x
            const delta_y = y - card.y 

            setCards(prev => prev.map(c => c.id === dragging.id ? { ...c, x, y } : c))
            setStickers(prev => prev.map(s => s.card_id === dragging.id 
                ? { ...s, x: s.x + delta_x, y: s.y + delta_y} 
                : s))
        } else {
            setStickers(prev => prev.map(s => s.id === dragging.id 
                ? { ...s, x, y } 
                : s))
        }
        
    }, [dragging])

    const onMouseUp = useCallback((
        e: MouseEvent, 
        boardRef: React.RefObject<HTMLDivElement | null>, 
        cards: any[], 
        stickers: any[], 
        setStickers: React.Dispatch<React.SetStateAction<Sticker[]>>
    ) => {
        if (!dragging) return
        if (!boardRef.current) return 
         

        if (dragging.type === "sticker") {
            const board = boardRef.current.getBoundingClientRect()
            const mx = e.clientX - board.left
            const my = e.clientY - board.top

            let hitCardId = null
            for (const card of cards) {
                if (
                    mx >= card.x && 
                    mx <= card.x + 240 && 
                    my >= card.y && 
                    my <= card.y + 100
                ) {
                    hitCardId = card.id
                    break 
                }
            }

            const nextStickers = stickers.map(s => 
                s.id === dragging.id ? { ...s, card_id: hitCardId } : s) 
            
            setStickers(nextStickers)
            saveBoard(cards, nextStickers)
            console.log("hello")
            console.log(hitCardId)    
        } else {
            saveBoard(cards, stickers)
        }
        
        setDragging(null)
    }, [dragging])

    return { onMouseDown, onMouseMove, onMouseUp }

}