# Helper functions — kept outside the route so they can be reused
def get_message(pct):
    if pct >= 85: return "Keep up the great work"
    if pct >= 57: return "Beautiful momentum ✨"
    if pct >= 28: return "A gentle start 🌿"
    return "Every step counts 🌱"

def get_streak_message(days):
    if days == 7: return "Perfect week! 💫"
    if days >= 5: return f"{days} days of intentional living!"
    if days >= 3: return f"{days} days tracked. Keep going!"
    if days >= 1: return f"{days} day tracked. The seed is planted 🌱"
    return "Drop a sticker onto a goal to start tracking ✨"