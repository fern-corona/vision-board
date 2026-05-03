import React from "react"
import type { Card, InsightsResponse, Sticker } from "../types"

interface Props {
    insights: InsightsResponse | null
    cards: Card[]
    stickers: Sticker[]
    COLORS: { bg: string; border: string; text: string }[]
    DAYS: string[]
}

export const InsightsPanel: React.FC<Props> = ({
    insights,
    cards,
    stickers,
    COLORS,
    DAYS
}) => {
    return (
        <div style={{ width: 290, background: "rgba(255,255,255,0.9)", borderLeft: "1px solid rgba(244,143,177,0.2)", overflowY: "auto", padding: 20 }}>
            <h2 style={{ margin: "0 0 4px", fontSize: "1.1rem", fontWeight: 400, color: "#8b4567" }}>
                Weekly Insights
            </h2>

            <p style={{ margin: "0 0 16px", fontSize: "0.7rem", color: "#b07090", letterSpacing: "0.1em" }}>
                {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase()}
            </p>

            <div style={{ background: "linear-gradient(135deg, #fce4ec, #e8eaf6)", borderRadius: 12, padding: "12px 14px", marginBottom: 16, textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#7b3f60", fontStyle: "italic" }}>
                    {insights?.streak_message ?? "Start tracking ✨"}
                </p>
            </div>

            {insights?.insights.map((ins, i) => (
                <div key={i} style={{ marginBottom: 12, padding: "10px 12px", background: "#fff8fb", border: "1px solid #f8d0e0", borderRadius: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: "0.85rem", color: "#5a2040" }}>
                            {ins.emoji} {ins.card_title}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "#9a5070" }}>
                            {ins.completed_on_card}/{ins.total_on_card}
                        </span>
                    </div>

                    <div style={{ height: 5, background: "#f8d0e0", borderRadius: 3 }}>
                        <div
                            style={{
                                height: "100%",
                                width: `${ins.percentage}%`,
                                background: "linear-gradient(90deg, #f48fb1, #ce93d8)",
                                borderRadius: 3,
                                transition: "width 0.5s ease"
                            }}
                        />
                    </div>

                    <p style={{ margin: "5px 0 0", fontSize: "0.68rem", color: "#9a5070" }}>
                        {ins.message}
                    </p>
                </div>
            ))}

            <p style={{ margin: "16px 0 8px", fontSize: "0.7rem", color: "#b07090", letterSpacing: "0.1em" }}>
                WEEK AT A GLANCE
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
                {DAYS.map(day => {
                    const s = stickers.find(s => s.day === day)
                    const card = s?.card_id ? cards.find(c => c.id === s.card_id) : undefined
                    const col = card ? COLORS[card.color % COLORS.length] : undefined

                    return (
                        <div key={day} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                            <div
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    background: col ? col.bg : "#f8f0f4",
                                    border: `1.5px solid ${col ? col.border : "#f0d0dc"}`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "0.85rem"
                                }}
                            >
                                {card ? card.emoji : "·"}
                            </div>

                            <span style={{ fontSize: "0.55rem", color: "#b090a0" }}>
                                {day}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}