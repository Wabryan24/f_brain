// client/src/components/ProfessorStats.jsx
import React, { useEffect, useState } from 'react';
import { fetchProfessors } from '../hooks/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer,
} from 'recharts';

const ProfessorStats = () => {
  const [professors, setProfessors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfessors()
      .then(data => {
        console.log("📊 Données récupérées :", data);
        setProfessors(data);
      })
      .catch(err => {
        console.error("Erreur lors du fetch des professeurs :", err);
        setError(err);
      });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Statistiques des Professeurs</h2>

      {error && (
        <p className="text-red-500">Une erreur est survenue lors du chargement des statistiques.</p>
      )}

      {professors.length === 0 ? (
        <p>Aucun vote enregistré pour le moment.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={professors}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="nombre_votes" fill="#8884d8" name="Nombre de Votes" />
            <Bar dataKey="moyenne_notes" fill="#82ca9d" name="Moyenne des Notes" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ProfessorStats;
