import { useState, useEffect, useRef,  } from "react"
import type { Card, Sticker } from "./types"
import { fetchBoard, saveBoard } from "./api/board"
import {Card as CardComponent } from "./components/Card"
import { Sticker as StickerComponent } from "./components/Sticker"
import { useDrag} from "./hooks/useDrag"

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const uid  = () => Math.random().toString(36).slice(2, 9)

// Default stickers — one circle per day of the week, laid out in a row at the bottom
const makeDefaultStickerButtons = () =>
  DAYS.map((d, i) => ({ id: uid(), day: d, x: 60 + i * 100, y: 600, card_id: null, isButton: true }))


export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [cards, setCards] = useState<Card[]>([])
  const [stickers, setStickers] = useState<Sticker[]>([])
  const boardRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const { onMouseDown, onMouseMove, onMouseUp } = useDrag()
  
  useEffect(() => {
    fetchBoard().then(data => {
      setCards(data.cards); 
      setStickers(data.stickers);
      setLoaded(true)
     })
  }, [])

  useEffect(() => {
    const move = (e: MouseEvent) =>
      onMouseMove(e, boardRef, cards, stickers, setCards, setStickers)

    const up = (e: MouseEvent) =>
      onMouseUp(e, boardRef, cards, stickers, setStickers)

    window.addEventListener("mousemove", move)
    window.addEventListener("mouseup", up)

    return () => {
      window.removeEventListener("mousemove", move)
      window.removeEventListener("mouseup", up)
    }
  }, [onMouseMove, onMouseUp, cards, stickers])

  const addCard = () => {
    const newPosition_x  = position.x + (Math.random() - 0.5) * 20
    const newPosition_y = position.y + (Math.random() - 0.5) * 20
    
    const newCard: Card = {
      id: uid(),
      title: "New Goal",
      affirmation: "I can do this",
      color: 0,
      x: newPosition_x,
      y: newPosition_y,
      emoji: "**"
    }
    
    const next = [...cards, newCard]
    setPosition({
      x: newPosition_x, // ±10px
      y: newPosition_y // ±10px
    });
    setCards(next)
    saveBoard(next, stickers)
  }

  const handleStickerDrag = (day: string) => {
    const newSticker: Sticker = {
      id: uid(),
      day,
      x: 100,
      y: 100,
      card_id: null
    } 
    const next = [...stickers, newSticker]
    setStickers(next)
    saveBoard(cards, next) 
  }




  if (!loaded) return <p>Loading...</p>

  return (
    <div 
      ref={boardRef}
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "#fdf6f0",
        overflow: "hidden",
      }}
    >
      <button
        onClick={addCard}
        style={{position: "absolute",
                top: 20,
                left: 20,
                zIndex: 10
        }}
      >
        + Add Card
      </button> 

      {cards.map(c => <CardComponent key={c.id} card={c} onMouseDown={(e, id) => onMouseDown(e, "card", id)} />)}
      {stickers.map(s => <StickerComponent key={s.id} sticker={s} cards={cards} onMouseDown={(e, id) => onMouseDown(e, "sticker", id)} />)}
      {makeDefaultStickerButtons().map((btn) => (
        <div
          key={btn.id}
          onMouseDown={() => handleStickerDrag(btn.day)}
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
    </div>
  )
}




// const API = "http://localhost:8000"
// const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
// const uid = (): string => Math.random().toString(36).slice(2,9)

// const makeDefaultStickers = (): Sticker[] =>
//   DAYS.map((d, i) => ({ id: uid(), day: d, x: 60 + i * 100, y: 600, card_id: null }))



// export default function App() {
//   const [cards, setCards] = useState<Card[]>([])
//   const [title, setTitle] = useState<string>("")
//   const [affirmation, setAffirmation] = useState<string>("")

//   const [stickers, setStickers] = useState<Sticker[]>([])
//   const [loaded, setLoaded] = useState<boolean>(false)
//   const [dragging, setDragging] = useState<DragState | null>(null)
//   const boardRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     fetch(`${API}/cards`)
//       .then(res => res.json())
//       .then((data: Card[]) => setCards(data))
//   }, [])

//   const addCard = async (): Promise<void> => {
//     if (!title) return 

//     const newCard: Card = {
//       id: uid(), title, affirmation, color: 0, x: 100, y:100, emoji: "*"
//     }

//     const res = await fetch(`${API}/cards`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(newCard),
//     })

//     const saved: Card = await res.json()

//     setCards(prev => [...prev, saved])
//     setTitle("")
//     setAffirmation("")

//   }

//   const deleteCard  = async (id: string): Promise<void> => {
//     await fetch(`${API}/cards/${id}`, { method : "DELETE" })
//     setCards(prev => prev.filter(c => c.id !== id))
//   }


//   return (
//     <div style={{ padding: 20 }}>
//       <h1>My Vision Board</h1>
//       <div style={{ marginBottom: 20 }}>
//         <input 
//           placeholder="Goal title"
//           value={title}
//           onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
//           style={{ marginRight: 8 }}
//         />
//         <input 
//           placeholder="Affirmation"
//           value={affirmation}
//           onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAffirmation(e.target.value)}
//           style={{ marginRight: 8 }}
//         />
//         <button onClick={addCard}>Add Card</button>
//       </div>
//       {cards.map(card => (
//         <div key={card.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
//           <h3>{card.title}</h3>
//           <p>{card.affirmation}</p>
//           <button onClick={() => deleteCard(card.id)}>Delete</button>
//         </div>
//       ))}
//     </div>
//   )
// }


