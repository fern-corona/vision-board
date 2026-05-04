import React, { useEffect, useRef } from "react"
import type { Card } from "../types"

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

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    
    const processImage = (img: HTMLImageElement) => {
        const canvas = canvasRef.current
        if (!canvas) return 
    
        const ctx = canvas.getContext("2d")
        if (!ctx) return 
    
        const size = 250
        canvas.width = size
        canvas.height = size
    
        ctx.clearRect(0, 0, size, size)
    
        const minSide = Math.min(img.width, img.height)
    
        const sx = (img.width - minSide) / 2
        const sy = (img.height - minSide) / 2
    
        console.log("DRAWING IMAGE", {
            imgW: img.width,
            imgH: img.height,
            sx,
            sy,
            minSide
        })
    
        ctx.drawImage(
            img,
            sx,
            sy,
            minSide,
            minSide,
            0,
            0,
            size,
            size
        )
    
        const base64 = canvas.toDataURL("image/jpg", 0.85)
    
        console.log("SETTING IMAGE BASE64 LENGTH:", base64.length)
    
        setEditingCard(p => {
            if (!p) return null
            return { ...p, image: base64 }
        })
    }

    const handleFile = (file: File) => {
        console.log("HANDLE FILE", file)
    
        const reader = new FileReader()
    
        reader.onload = () => {
            const img = new Image()
    
            img.onload = () => {
                console.log("IMAGE LOADED")
                processImage(img)
            }
    
            img.onerror = (err) => {
                console.error("IMAGE FAILED TO LOAD", err)
            }
    
            img.src = reader.result as string
        }
    
        reader.onerror = (err) => {
            console.error("FILE READER FAILED", err)
        }
    
        reader.readAsDataURL(file)
    }

    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            if (!editingCard) return

            const items = e.clipboardData?.items
            if (!items) return

            for (const item of items) {
                if (item.type.startsWith("image/")) {
                    const file = item.getAsFile()
                    if (file) {
                        handleFile(file)
                    }
                }
            }
        }
        window.addEventListener("paste", handlePaste)
        return () => window.removeEventListener("paste", handlePaste)
    }, [editingCard])


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

                {/* Image Upload */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label style={{ fontSize: 13, color: "#666", textAlign: "left" }}>
                        Image (paste or upload)
                    </label>

                    {/* Preview */}
                    {editingCard.image && (
                        <img
                            src={editingCard.image}
                            alt="preview"
                            style={{
                                width: 100,
                                height: 100,
                                objectFit: "cover",
                                borderRadius: 10,
                                border: "1px solid #ddd"
                            }}
                        />
                    )}

                    {/* File input */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                            console.log("FILE INPUT TRIGGERED")
                            const file = e.target.files?.[0]
                            console.log("FILE:", file)
                            if (file) handleFile(file)
                        }}
                    />

                    <small style={{ color: "#999" }}>
                        Tip: Paste an image directly (Ctrl+V)
                    </small>
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

