import React from "react" 
import type { Card as CardType } from "../types"

interface Props {
    card: CardType
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>, id: string) => void
}

export const Card: React.FC<Props> = ({card, onMouseDown }) => (
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
        <h3 style={{ margin: 0 }}>{card.title}</h3>
        <p style={{ margin: "8px 0 0", fontSize: 14 }}>{card.affirmation}</p>
    </div>
)