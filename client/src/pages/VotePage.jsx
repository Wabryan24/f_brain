// client/src/pages/VotePage.jsx
import React from 'react';
import VoteForm from '../components/VoteForm';

const VotePage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🗳️ Vote pour le meilleur professeur 🎓</h1>
      <VoteForm />
    </div>
  );
};

export default VotePage;
