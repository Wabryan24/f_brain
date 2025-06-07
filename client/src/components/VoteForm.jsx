// client/src/components/VoteForm.jsx
import React, { useEffect, useState } from 'react';
import { fetchProfessors, submitVote } from '../hooks/api';

const VoteForm = () => {
  const [professors, setProfessors] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState('');
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfessors().then(setProfessors).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitVote({
        professor: selectedProfessor,
        note,
        commentaire
      });
      setMessage("✅ Vote soumis avec succès !");
      setSelectedProfessor('');
      setNote(5);
      setCommentaire('');
    } catch (error) {
      console.error("Erreur lors de l'envoi du vote :", error);
      setMessage("❌ Erreur lors de l'envoi du vote");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🗳️ Voter pour un professeur</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Professeur</label>
          <select
            value={selectedProfessor}
            onChange={(e) => setSelectedProfessor(e.target.value)}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">-- Choisir un professeur --</option>
            {professors.map((prof) => (
              <option key={prof.id} value={prof.id}>{prof.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Note (1 à 5)</label>
          <input
            type="number"
            value={note}
            onChange={(e) => setNote(Number(e.target.value))}
            min="1"
            max="5"
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Commentaire</label>
          <textarea
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Votre commentaire (optionnel)"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Envoyer le vote
        </button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default VoteForm;
