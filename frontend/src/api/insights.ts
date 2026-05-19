import type {InsightsResponse} from "../types";

//const API = "http://localhost:8000"

const API = "https://vision-board-api.onrender.com"


export const fetchInsights = async(): Promise<InsightsResponse> => {
    const res = await fetch(`${API}/insights`);
    return res.json();
}