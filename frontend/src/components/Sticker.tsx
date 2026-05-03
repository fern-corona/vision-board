import React from "react"
import type { Sticker as StickerType, Card as CardType } from "../types"

interface Props {
    sticker: StickerType 
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>, id: string) => void
    COLORS: { bg: string; border: string, text: string}[]
    //index: number
}

export const Sticker: React.FC<Props> = ({ sticker, onMouseDown, COLORS }) => {
    //const assignedCard = sticker.card_id ? cards.find(c => c.id === sticker.card_id) : undefined
    const getBorderColor = (card: CardType) => {
        return COLORS[card.color % COLORS.length].border
    }
    const stickerWidth = 56
    const stickerGap = 5

    return (
        <div 
        onMouseDown={e => onMouseDown(e, sticker.id)}
        style={{
          position: "absolute",
  
          // 👉 NOW POSITION COMES FROM PARENT CARD LAYOUT
          left: sticker.x,
          top: sticker.y,
  
          width: stickerWidth,
          height: stickerWidth,
          borderRadius: "50%",
  
          background: "#fff",
  
          border: "2px solid #f48fb1",
  
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
  
          cursor: "grab",
          userSelect: "none",
  
          fontWeight: "bold",
          fontSize: 13,
          zIndex: 5
        }}
        >
            {sticker.day}
        </div>
    )
}