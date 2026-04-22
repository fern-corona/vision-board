import React from "react"
import type { Sticker as StickerType, Card as CardType } from "../types"

interface Props {
    sticker: StickerType 
    cards: CardType[]
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>, id: string) => void
    COLORS: { bg: string; border: string, text: string}[]
}

export const Sticker: React.FC<Props> = ({ sticker, cards, onMouseDown, COLORS }) => {
    const assignedCard = sticker.card_id ? cards.find(c => c.id === sticker.card_id) : undefined
    const getBorderColor = (card: CardType) => {
        return COLORS[card.color % COLORS.length].border
    }
    return (
        <div 
            onMouseDown={e => onMouseDown(e, sticker.id)}
            style={{
                position: "absolute", 
                left: sticker.x,
                top: sticker.y,
                width: 56,
                borderRadius: "50%",
                background: assignedCard 
                    ? `linear-gradient(
                            rgba(0,0,0,0.200),
                            rgba(0,0,0,0.200)
                        ), ${COLORS[assignedCard.color].bg}`
                    : "#ffff",
                border: assignedCard 
                    ? `2px solid ${getBorderColor(assignedCard)}`
                        : "2px solid #f48fb1",
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