import type {InsightsResponse} from "../types";

const API = "http://localhost:8000"


export const fetchInsights = async(): Promise<InsightsResponse> => {
    const res = await fetch(`${API}/insights`);
    return res.json();
}