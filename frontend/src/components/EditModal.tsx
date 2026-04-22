import React from "react"
import type { Card, Sticker } from "../types"

interface Props {
    editingCard: Card | null
    setEditingCard: React.Dispatch<React.SetStateAction<Card | null>>
    saveEdit: () => void 
    COLORS: { bg: string; border: string; text: string}[]
}

export const EditModal: React.FC<Props> = ({
    editingCard,
    setEditingCard, 
    saveEdit,
    COLORS
}) => {
    if (!editingCard) return null

    return (
        <div
            onClick={() => setEditingCard(null)}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(100, 60, 80, 0.3)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 100,
                }}
        >
            <div
                onClick={e=> e.stopPropagation()}
                style={{
                    background: "white",
                    borderRadius: 20,
                    padding: 28, 
                    width: 360,
                    boxShadow: "0 20px 60px rgba(120, 60, 90, 0.2)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16
                    }}
            >
                <h3 style={{ margin: "0 0 16px", color: "#8b4567" }}>
                    Edit Goal
                </h3>

                {/* Title */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ 
                        fontSize: 13, 
                        color: "#666",
                        textAlign: "left",
                    }}
                    >
                    Title
                    </label>
                    <input
                        value={editingCard.title}
                        onChange={e => 
                            setEditingCard(p => (p ? { ...p, title: e.target.value } : null))
                        }
                        style={{
                            padding: "10px 12px",
                            borderRadius: 10,
                            border: "1px solid #add",
                            fontSize: 14
                        }}
                    />
                </div>

                {/* Affirmation */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6
                }}>
                    <label style={{
                        display: "flex",
                        flexDirection: "column",
                        textAlign: "left",
                        gap: 6
                    }}>
                    Affirmation
                    </label>
                    <textarea 
                        value={editingCard.affirmation}
                        onChange={e => 
                            setEditingCard(p => p ? ({ ...p, affirmation: e.target.value }) : null)
                        }
                        style={{
                            padding: "10px 12px",
                            borderRadius: 10,
                            border: "1px solid #ddd",
                            fontSize: 14,
                            minHeight: 80,
                            resize: "none"
                        }}
                    />
                </div>

                {/* COLORS */}
                <div style={{ 
                    display: "flex",
                    gap: 10,
                }}>
                    {COLORS.map((col, i) => (
                        <div
                            key={i}
                            onClick={() => 
                                setEditingCard(p => p && ({ ...p, color: i}))
                            }
                            style={{
                                width: 28, 
                                height: 28,
                                borderRadius: "50%",
                                background: col.bg,
                                border: 
                                    editingCard.color === i
                                        ? `3px solid ${col.border}`
                                        : `2px solid ${col.border}`,
                                cursor: "pointer"
                            }}
                        >
                        </div>
                        ))
                    }
                </div>

                {/* Buttons */}
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 10
                }}>
                    <button 
                        type= "button"
                        onClick={() => setEditingCard(null)}
                        style={{
                            padding: "8px 14px",
                            borderRadius: 8,
                            border: "1px solid #ccc",
                            background: "#f5f5f5",
                            cursor: "pointer",
                        }}
                    >
                    Cancel
                    </button> 
                    <button 
                        type="button"
                        onClick={saveEdit}
                        style={{
                        padding: "8px 14px",
                        borderRadius: 8,
                        border: "1px solid #ccc",
                        background: "#f5f5f5",
                        cursor: "pointer",
                        }}
                    >
                    Save
                    </button>
                </div>
        
            </div> 
        </div>

        )
    }

