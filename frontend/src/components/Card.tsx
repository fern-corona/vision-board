import React, { useState } from "react";
import type { Card as CardType, Sticker } from "../types";

const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const COLORS = [
  { bg: "#fce4ec", border: "#f48fb1", text: "#880e4f" },
  { bg: "#e8f5e9", border: "#a5d6a7", text: "#1b5e20" },
  { bg: "#e3f2fd", border: "#90caf9", text: "#0d47a1" },
  { bg: "#fff8e1", border: "#ffe082", text: "#e65100" },
  { bg: "#f3e5f5", border: "#ce93d8", text: "#4a148c" },
];

interface Props {
  card: CardType;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>, id: string) => void;
  onDelete: (id: string) => void;
  setEditingCard: any;
  col: {
    bg: string;
    border: string;
    text: string;
  };
  onStickerUpdate: (
    cardId: string,
    stickerId: string,
    change: "complete" | "incomplete" | "reset" | "delete"
  ) => void;
}

export const Card: React.FC<Props> = ({
  card,
  onMouseDown,
  onDelete,
  setEditingCard,
  col,
  onStickerUpdate,
}) => {
  const [hoveredStickerId, setHoveredStickerId] = useState<string | null>(null);

  const sortedStickers = [...(card.stickers || [])].sort(
    (a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day)
  );

  const hasStickers = sortedStickers.length > 0;

  return (
    <div
      id={card.id}
      onMouseDown={(e) => onMouseDown(e, card.id)}
      style={{
        position: "absolute",
        left: card.x,
        top: card.y,
        width: 200,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: 16,
        background: col.bg,
        border: `1.5px solid ${col.border}`,
        cursor: "grab",
        userSelect: "none",
        boxShadow: "0 4px 20px rgba(180, 120, 140, 0.1)",
      }}
    >
      {/* Image */}
      {card.image && (
        <img
          src={card.image}
          alt="card"
          draggable={false}
          style={{
            width: "100%",
            height: 140,
            objectFit: "cover",
            borderRadius: 10,
            border: `1px solid ${col.border}`,
            display: "block",
            pointerEvents: "none", // prevents drag interference
          }}
        />
      )}

      {/* Title */}
      <h3
        style={{
          margin: "0",
          fontSize: "0.95rem",
          color: col.text,
        }}
      >
        {card.title}
      </h3>

      {/* Affirmation */}
      <p
        style={{
          margin: "0",
          fontSize: "0.8rem",
          color: col.text,
          opacity: 0.8,
          fontStyle: "italic",
        }}
      >
        {card.affirmation}
      </p>

      {/* Edit button */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          data-no-drag="true"
          onClick={(e) => {
            e.stopPropagation();
            setEditingCard(card);
          }}
          style={{
            fontSize: "0.7rem",
            padding: "3px 8px",
            border: `1px solid ${col.border}`,
            background: "transparent",
            borderRadius: 5,
            cursor: "pointer",
            color: col.text,
          }}
        >
          Edit
        </button>
      </div>

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(card.id);
        }}
        data-no-drag="true"
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
        }}
      >
        🗑️
      </button>

      {/* Sticker Button Row */}
      {hasStickers && (
        <div
          data-no-drag="true"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            borderTop: `1px solid ${col.border}`,
            paddingTop: 8,
          }}
        >
          {sortedStickers.map((s: Sticker) => {
            const isHovered = hoveredStickerId === s.id;
            const isMarked = s.status !== "none";

            return (
              <div
                key={s.id}
                data-no-drag="true"
                onMouseDown={(e) => e.stopPropagation()}
                onMouseEnter={() => setHoveredStickerId(s.id)}
                onMouseLeave={() => setHoveredStickerId(null)}
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "flex-end",
                  paddingTop: 36,
                  marginTop: -36,
                  cursor: "default",
                }}
              >
                {/* Popup — rendered INSIDE the wrapper so mouse stays within it */}
                {isHovered && (
                  <div
                    data-no-drag="true"
                    onMouseDown={(e) => e.stopPropagation()}
                    style={{
                      position: "absolute",
                      top: 0, // ← sits at top of the padded space, not outside it
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "white",
                      border: `1px solid ${col.border}`,
                      borderRadius: 8,
                      padding: "4px 6px",
                      display: "flex",
                      gap: 4,
                      zIndex: 100,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    }}
                  >
                    {!isMarked ? (
                      <>
                        <button
                          data-no-drag="true"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStickerUpdate(card.id, s.id, "complete");
                          }}
                          title="Mark as done"
                          style={{
                            background: "#e8f5e9",
                            border: "1px solid #a5d6a7",
                            borderRadius: 4,
                            cursor: "pointer",
                            fontSize: 10,
                            padding: "2px 5px",
                            color: "#1b5e20",
                            fontWeight: 700,
                          }}
                        >
                          ✓
                        </button>

                        <button
                          data-no-drag="true"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStickerUpdate(card.id, s.id, "incomplete");
                          }}
                          title="Mark as not done"
                          style={{
                            background: "#ffebee",
                            border: "1px solid #ef9a9a",
                            borderRadius: 4,
                            cursor: "pointer",
                            fontSize: 10,
                            padding: "2px 5px",
                            color: "#b71c1c",
                            fontWeight: 700,
                          }}
                        >
                          ✕
                        </button>

                        <button
                          data-no-drag="true"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStickerUpdate(card.id, s.id, "delete");
                          }}
                          title="Remove sticker"
                          style={{
                            background: "#fff8e1",
                            border: "1px solid #ffe082",
                            borderRadius: 4,
                            cursor: "pointer",
                            fontSize: 10,
                            padding: "2px 5px",
                            color: "#e65100",
                          }}
                        >
                          🗑
                        </button>
                      </>
                    ) : (
                      <button
                        data-no-drag="true"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStickerUpdate(card.id, s.id, "reset");
                        }}
                        title="Reset status"
                        style={{
                          background: "#f3e5f5",
                          border: "1px solid #ce93d8",
                          borderRadius: 4,
                          cursor: "pointer",
                          fontSize: 10,
                          padding: "2px 5px",
                          color: "#4a148c",
                        }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                )}

                {/* Pill */}
                <div
                  style={{
                    padding: "2px 7px",
                    background: col.border,
                    color: col.text,
                    borderRadius: 20,
                    fontSize: "0.65rem",
                    fontFamily: "sans-serif",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    userSelect: "none",
                    cursor: "default",
                    opacity: isHovered ? 0.85 : 1,
                    transition: "opacity 0.15s",
                    position: "relative",
                  }}
                >
                  {s.day}

                  {/* Status indicator — only when marked and not hovered */}
                  {isMarked && (
                    <span
                      style={{
                        position: "absolute",
                        top: -5,
                        right: -5,
                        fontSize: 9,
                        lineHeight: 1,
                        background:
                          s.status === "complete" ? "#4caf50" : "#e53935",
                        color: "white",
                        borderRadius: "50%",
                        width: 12,
                        height: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {s.status === "complete" ? "✓" : "✕"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
