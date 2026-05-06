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

        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, size, size)

        const scale = Math.min(size / img.width, size / img.height)
        const drawW = img.width * scale
        const drawH = img.width * scale 

        const offsetX = (size - drawW) / 2
        const offsetY = (size - drawH) / 2

        ctx.drawImage(img, offsetX, offsetY, drawW, drawH)

    
        const base64 = canvas.toDataURL("image/jpeg", 0.85)
    
        setEditingCard(p => p ? { ...p, image: base64 } : null)
    }

    const handleFile = (file: File) => {
    
        const reader = new FileReader()
    
        reader.onload = () => {
            const img = new Image()
    
            img.onload = () => {
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

            const itemArray = Array.from(items)
    
            for (const item of itemArray ) {
                if (item.type.startsWith("image/")) {
                    const file = item.getAsFile()
                    if (file) {
                        handleFile(file)
                        return
                    }
                }
                // if (item.type.startsWith("image/")) {
                //     const file = item.getAsFile()
                //     if (!file) continue
    
                //     const reader = new FileReader()
                //     reader.onload = () => {
                //         const img = new Image()
                //         img.onload = () => {
                //             const canvas = canvasRef.current
                //             if (!canvas) return
    
                //             const ctx = canvas.getContext("2d")
                //             if (!ctx) return
    
                //             const size = 250
                //             canvas.width  = size
                //             canvas.height = size
    
                //             ctx.fillStyle = "#ffffff"
                //             ctx.fillRect(0, 0, size, size)
    
                //             const scale   = Math.min(size / img.width, size / img.height)
                //             const drawW   = img.width  * scale
                //             const drawH   = img.height * scale
                //             const offsetX = (size - drawW) / 2
                //             const offsetY = (size - drawH) / 2
    
                //             ctx.drawImage(img, offsetX, offsetY, drawW, drawH)
    
                //             const base64 = canvas.toDataURL("image/jpeg", 0.85)
                //             setEditingCard(p => p ? { ...p, image: base64 } : null)
                //         }
                //         img.src = reader.result as string
                //     }
                //     reader.readAsDataURL(file)
                //     break  //
                // }
            }

            const htmlItem = itemArray.find(i => i.type === "text/html")
            if (htmlItem) {
                htmlItem.getAsString(async (html) => {
                    const parser = new DOMParser()
                    const doc    = parser.parseFromString(html, "text/html")
                    const imgEl  = doc.querySelector("img")

                    if (!imgEl?.src) {
                        console.log("No img src found in HTML clipboard")
                        return
                    }
        

                    try {
                        const res  = await fetch(imgEl.src)
                        const blob = await res.blob()
                        const file = new File([blob], "pasted-image.png", { type: blob.type })
                        handleFile(file)
                    } catch (err) {
                        console.error("Failed to fetch Google Docs image:", err)
                        alert("Could not paste from Google Docs — try right-clicking the image and saving it first, then use the Browse button to upload it.")
                    }
                })
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
            <canvas ref={canvasRef} style={{ display: "none" }} />
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
                        <div style={{ position: "relative", display: "inline-block" }}>
                            <img
                                src={editingCard.image}
                                alt="preview"
                                style={{
                                    width: 100,
                                    height: 100,
                                    objectFit: "cover",
                                    borderRadius: 10,
                                    border: "1px solid #ddd",
                                    display: "block",
                                }}
                            />
                            <button 
                                onClick={() => setEditingCard(p => p ? {...p, image: undefined } : null)}
                                style={{
                                    position: "absolute",
                                    top: -8,
                                    right: -8,
                                    width: 22, 
                                    height: 22, 
                                    borderRadius: "50%",
                                    background: "#e57373",
                                    color: "white",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: 12, 
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                x 
                            </button> 
                        </div>
                    )}

                    {/* File input */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => { 
                            const file = e.target.files?.[0]
                            if (file) handleFile(file)
                        }}
                        style={{ fontSize: 13 }}
                    />

                    <small 
                        style={{ 
                            color: "#999" 
                        }}>
                            Tip: You can also paste an image (Ctrl+V / Cmd+V)
                    </small>
                </div>

                {/* Color Picker */}
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

