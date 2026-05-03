import { useState, useEffect, useRef } from "react"
import type { InsightsResponse, Card, Sticker } from "./types"
import { fetchBoard, saveBoard } from "./api/board"
import { fetchInsights } from "./api/insights"
import { Card as CardComponent } from "./components/Card"
import { useDrag } from "./hooks/useDrag"
import { EditModal } from "./components/EditModal"
import { InsightsPanel } from "./components/InsightsPanel"

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const COLORS = [
  { bg: "#fce4ec", border: "#f48fb1", text: "#880e4f" },
  { bg: "#e8f5e9", border: "#a5d6a7", text: "#1b5e20" },
  { bg: "#e3f2fd", border: "#90caf9", text: "#0d47a1" },
  { bg: "#fff8e1", border: "#ffe082", text: "#e65100" },
  { bg: "#f3e5f5", border: "#ce93d8", text: "#4a148c" },
]

const uid = () => Math.random().toString(36).slice(2, 9)


const DAY_BUTTONS = DAYS.map((d, i) => ({
  day: d,
  x: 60 + i * 100,
  y: 600,
}))

export default function App() {
  const [loaded, setLoaded]       = useState<boolean>(false)
  const [cards, setCards]         = useState<Card[]>([])
  const [showPanel, setShowPanel] = useState<boolean>(true)
  const [insights, setInsights]   = useState<InsightsResponse | null>(null)
  const [editingCard, setEditingCard] = useState<Card | null>(null)

  const boardRef = useRef<HTMLDivElement>(null)


const onStickerUpdate = (
  cardId: string,
  stickerId: string,
  change: "complete" | "incomplete" | "reset" | "delete"
) => {
  const next = cards.map(card => {
      if (card.id !== cardId) return card

      if (change === "delete") {
        
        return { ...card, stickers: (card.stickers || []).filter(s => s.id !== stickerId) }
      }

    
      return {
        ...card,
        stickers: (card.stickers || []).map(s =>
          s.id === stickerId
          ? { ...s, status: (change === "reset" ? "none" : change) as Sticker["status"] }
            : s
        )
      }
    })

    setCards(next)
    saveBoard(next).then(() => fetchInsights().then(setInsights))
  }

  const {
    draggingSticker,
    onMouseDown,
    onStickerMouseDown,
    onMouseMove,
    onMouseUp,
  } = useDrag()

  // ── Load board ────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchBoard().then(data => {
      setCards(data.cards)
      setLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (!loaded) return
    fetchInsights().then(setInsights)
  }, [loaded])


  useEffect(() => {
    const move = (e: MouseEvent) => onMouseMove(e, boardRef, cards, setCards)

    const up = (e: MouseEvent) => onMouseUp(
      e, 
      cards, 
      setCards, 
      saveBoard,
      () => fetchInsights().then(setInsights)
    )
    window.addEventListener("mousemove", move)
    window.addEventListener("mouseup", up)
    return () => {
      window.removeEventListener("mousemove", move)
      window.removeEventListener("mouseup", up)
    }
  }, [cards, onMouseMove, onMouseUp])

  const addCard = () => {
    const newCard: Card = {
      id: uid(),
      title: "New Goal",
      affirmation: "I can do this",
      color: 0,
      x: 200 + Math.random() * 40,
      y: 150 + Math.random() * 40,
      emoji: "🌸",
      stickers: []
    }
    const next = [...cards, newCard]
    setCards(next)
    saveBoard(next)
  }

  const deleteCard = (id: string) => {
    const next = cards.filter(c => c.id !== id)
    setCards(next)
    saveBoard(next)
  }

  const saveEdit = () => {
    if (!editingCard) return
    const next = cards.map(c => c.id === editingCard.id ? { ...c, ...editingCard } : c)
    setCards(next)
    saveBoard(next)
    setEditingCard(null)
  }

  if (!loaded) return <p style={{ padding: 40 }}>Loading...</p>

  return (
    <div style={{ 
      display: "flex", 
      height: "100vh", 
      width: "100%",
      fontFamily: "Georgia, serif", 
      background: "linear-gradient(135deg, #fdf6f0, #fce8f3, #e8f0fe)",
      }}>

      {/* ── BOARD ─────────────────────────────────────────────────────────── */}
      <div
        ref={boardRef}
        style={{ flex: 1, position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #fdf6f0, #fce8f3, #e8f0fe)" }}
      >
        {/* Header */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "14px 20px", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 300, color: "#8b4567" }}>Vision Board</h1>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={addCard} style={{ padding: "8px 16px", background: "linear-gradient(135deg, #f48fb1, #ce93d8)", color: "white", border: "none", borderRadius: 40, cursor: "pointer", fontSize: "0.85rem" }}>
              + Add Goal
            </button>
            <button onClick={() => setShowPanel(v => !v)} style={{ padding: "8px 16px", background: "rgba(255,255,255,0.8)", border: "1px solid #f0b8cc", borderRadius: 40, cursor: "pointer", fontSize: "0.85rem", color: "#8b4567" }}>
              {showPanel ? "Hide" : "Show"} Insights
            </button>
          </div>
        </div>

        {/* Goal cards */}
        {cards.map(c => {
          const col = COLORS[c.color % COLORS.length]
          return (
            <CardComponent
              key={c.id}
              card={c}
              onMouseDown={(e, id) => onMouseDown(e, "card", id)}
              onDelete={() => deleteCard(c.id)}
              setEditingCard={setEditingCard}
              col={col}
              onStickerUpdate={onStickerUpdate}
            />
          )
        })}

        {/* Day buttons */}
        {DAY_BUTTONS.map(btn => (
          <div
            data-no-drag="true"
            key={btn.day}
            onMouseDown={e => onStickerMouseDown(e, btn.day, uid)}
            style={{
              position: "absolute",
              left: btn.x,
              top: btn.y,
              width: 56,
              height: 56,
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
              zIndex: 5,
            }}
          >
            {btn.day}
          </div>
        ))}

        {/* Ghost sticker */}
        {draggingSticker && (
          <div
            style={{
              position: "fixed",
              left: draggingSticker.x - 28,  
              top: draggingSticker.y - 28,
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#fce4ec",
              border: "2px solid #f48fb1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none", 
              fontWeight: "bold",
              fontSize: 13,
              opacity: 0.85,
              zIndex: 9999,
            }}
          >
            {draggingSticker.day}
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editingCard && (
        <EditModal
          editingCard={editingCard}
          setEditingCard={setEditingCard}
          saveEdit={saveEdit}
          COLORS={COLORS}
        />
      )}

      {/* Insights panel */}
      {showPanel && (
        <InsightsPanel
          insights={insights}
          cards={cards}
          stickers={cards.flatMap(c => c.stickers || [])}
          COLORS={COLORS}
          DAYS={DAYS}
        />
      )}
    </div>
  )
}