import { useState, useCallback } from "react"
import type { Card, DragState, Sticker } from "../types"

// DAY_ORDER is used to sort stickers on a card in calendar order.
// When a new sticker is dropped, we insert it and then sort the whole
// array by this order rather than append it to the end.
const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export const useDrag = () => {
    const [dragging, setDragging] = useState<DragState | null>(null)

    // draggingSticker holds a sticker that is currently being dragged
    // across the screen. It follows the mouse until dropped or deleted.
    const [draggingSticker, setDraggingSticker] = useState<Sticker | null>(null)

    // ── Card drag start ────────────────────────────────────────────────────
    const onMouseDown = useCallback((
        e: React.MouseEvent,
        type: "card",
        id: string
    ) => {
        // If the click started inside a [data-no-drag] element (like a button),
        // don't start a card drag
        if ((e.target as HTMLElement).closest("[data-no-drag]")) return

        e.preventDefault()
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        setDragging({ type, id, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top })
    }, [])

    // ── Sticker drag start ─────────────────────────────────────────────────
    // Called when the user presses down on a day button.
    // Creates a fresh sticker object that follows the mouse.
    const onStickerMouseDown = useCallback((
        e: React.MouseEvent,
        day: string,
        uid: () => string
    ) => {
        e.preventDefault()
        e.stopPropagation()

        const newSticker: Sticker = {
            id: uid(),
            day,
            x: e.clientX,
            y: e.clientY,
            card_id: null,
            status: "none"
        }
        setDraggingSticker(newSticker)
    }, [])

    // ── Mouse move ─────────────────────────────────────────────────────────
    // Handles both card dragging and sticker dragging.
    // For cards: calculates position relative to the board container.
    // For stickers: just tracks the raw mouse position (fixed on screen).
    const onMouseMove = useCallback((
        e: MouseEvent,
        boardRef: React.RefObject<HTMLDivElement | null>,
        cards: Card[],
        setCards: React.Dispatch<React.SetStateAction<Card[]>>
    ) => {
        // ── Sticker following mouse ──
        if (draggingSticker) {
            setDraggingSticker(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null)
            return
        }

        // ── Card following mouse ──
        if (!dragging || !boardRef.current) return
        if (dragging.type !== "card") return

        const board = boardRef.current.getBoundingClientRect()
        const x = e.clientX - board.left - dragging.offsetX
        const y = e.clientY - board.top - dragging.offsetY

        setCards(prev => prev.map(c =>
            c.id === dragging.id ? { ...c, x, y } : c
        ))
    }, [dragging, draggingSticker])

    // ── Mouse up ───────────────────────────────────────────────────────────
    // For stickers: checks if the mouse is over a card element by ID.
    // If yes — attach the sticker to that card, inserting it in day order.
    // If no  — discard the sticker entirely (don't add it anywhere).
    const onMouseUp = useCallback((
        e: MouseEvent,
        cards: Card[],
        setCards: React.Dispatch<React.SetStateAction<Card[]>>,
        saveBoard: (cards: Card[]) => void
    ) => {
        // ── Card drag end ──
        if (dragging) {
            setDragging(null)
            saveBoard(cards)
            return
        }

        // ── Sticker drag end ──
        if (!draggingSticker) return

        let droppedOnCard: Card | undefined

        for (const card of cards) {
            const el = document.getElementById(card.id)
            if (!el) continue

            const rect = el.getBoundingClientRect()

            if (
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom
            ) {
                droppedOnCard = card
                break
            }
        }

        if (droppedOnCard) {
            const nextCards = cards.map(card => {
                if (card.id !== droppedOnCard!.id) return card

                const existing = card.stickers || []

                const alreadyHasDay = existing.some(s => s.day === draggingSticker.day)
                if (alreadyHasDay) return card

                const updated = [...existing, { ...draggingSticker, card_id: card.id }]
                    .sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day))

                return { ...card, stickers: updated }
            })

            setCards(nextCards)
            saveBoard(nextCards)
        }

        setDraggingSticker(null)
    }, [dragging, draggingSticker])

    return {
        dragging,
        draggingSticker,
        onMouseDown,
        onStickerMouseDown,
        onMouseMove,
        onMouseUp
    }
}