import React from "react" 
import type { Card as CardType } from "../types"

interface Props {
    card: CardType
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>, id: string) => void
    onDelete: (id: string) => void
    setEditingCard: any 
    col: {
        bg: string
        border: string
        text: string
    }
}

export const Card: React.FC<Props> = ({card, onMouseDown, onDelete, setEditingCard, col }) => (
    <div
    onMouseDown={e => onMouseDown(e, card.id)}
    style={{ 
        position: "absolute", 
        left: card.x, 
        top: card.y, 
        width: 200, 
        padding: 16, 
        background: col.bg, 
        border: `1.5px solid ${col.border}`, 
        cursor: "grab", 
        userSelect: "none",
        boxShadow: "0 4px 20px rgba(180, 120, 140, 0.1)" 
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
                background: col.border, //"#F8C8DC",
                cursor: "pointer",
                fontSize: 15,
                padding: 3,
                borderRadius: 3,

            }}>
            🗑️
        </button>
        {/* Buttons */}
        <div style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            display: "flex",
            marginTop: 10,
            gap: 6
        }}
        >
            <button onClick={
                e => { e.stopPropagation(); setEditingCard(card) 
                    
            }}
            style= {{
                fontSize: "0.7rem",
                padding: "3px 8px", 
                border: `1px solid ${col.border}`,
                background: "transparent",
                borderRadius: 5,
                cursor: "pointer",
                color: col.text,
            }}>
                Edit
            </button>

        </div>
        <h3 style={{ 
            margin: "0 0 6px",
            fontSize: "0.95rem",
            color: col.text 
            }}>
            {card.title}
        </h3>
        <p style={{ 
            margin: "0", 
            fontSize: "0.8rem",
            color: col.text,
            opacity: 0.8,
            fontStyle: "italic",
            }}>
            {card.affirmation}
        </p>
    </div>
)