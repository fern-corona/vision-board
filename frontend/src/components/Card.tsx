import React from "react" 
import type { Card as CardType } from "../types"

interface Props {
    card: CardType
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>, id: string) => void
    onDelete: (id: string) => void
}

export const Card: React.FC<Props> = ({card, onMouseDown, onDelete }) => (
    <div
    onMouseDown={e => onMouseDown(e, card.id)}
    style={{
        position: "absolute",
        left: card.x,
        top: card.y,
        width: 200, 
        padding: 16,
        background: "white",
        border: "2px solid #f48fb1",
        userSelect: "none",
    }}
    >   
    <button
        onClick={(e) => {
            e.stopPropagation()
            onDelete(card.id)
        }}
        style={{
            position: "absolute",
            top: -15,
            right: -10,
            border: "none",
            background: "#F8C8DC",
            cursor: "pointer",
            fontSize: 15,
            padding: 3,
            borderRadius: 3,

        }}
    >
        🗑️
    </button>
        <h3 style={{ margin: 0 }}>{card.title}</h3>
        <p style={{ margin: "8px 0 0", fontSize: 14 }}>{card.affirmation}</p>
    </div>
)