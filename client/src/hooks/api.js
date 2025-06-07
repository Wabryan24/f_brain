// client/src/hooks/api.js
import axios from "axios";

export const api = axios.create({
  baseURL: "http://web:8000/",
});

// Récupérer tous les professeurs avec nombre de votes et moyenne
export const fetchProfessors = async () => {
  const response = await api.get("api/professors/");
  return response.data;
};

// Soumettre un vote
export const submitVote = async (voteData) => {
  const response = await api.post("api/votes/", voteData);
  return response.data;
};
