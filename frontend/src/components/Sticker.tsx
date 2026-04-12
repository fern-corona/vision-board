import React from "react"
import type { Sticker as StickerType, Card as CardType } from "../types"

interface Props {
    sticker: StickerType 
    cards: CardType[]
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>, id: string) => void
}

export const Sticker: React.FC<Props> = ({ sticker, cards, onMouseDown }) => {
    const assignedCard = sticker.card_id ? cards.find(c => c.id === sticker.card_id) : undefined
    return (
        <div 
            onMouseDown={e => onMouseDown(e, sticker.id)}
            style={{
                position: "absolute", 
                left: sticker.x,
                top: sticker.y,
                width: 56,
                borderRadius: "50%",
                background: assignedCard ? "#fce4ec" : "#fff",
                border: "2px solid #f48fb1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "grab",
                userSelect: "none",
                fontWeight: "bold",
                fontSize: 13,
            }}
        >
            {sticker.day}
        </div>
    )
}