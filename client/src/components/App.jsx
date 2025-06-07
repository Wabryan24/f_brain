import { useEffect, useState } from 'react'
import { api } from "../hooks/api.js"

function App() {
  const [professors, setProfessors] = useState([])
  const [selectedProfessor, setSelectedProfessor] = useState(null)
  const [comment, setComment] = useState('')
  const [score, setScore] = useState(5)

  useEffect(() => {
    api.get('api/professors/')
      .then(response => setProfessors(response.data))
      .catch(error => console.error(error))
  }, [])

  const handleVote = () => {
    if (!selectedProfessor) return alert("Sélectionnez un professeur.")
    api.post('api/votes/', {
      professor: selectedProfessor,
      comment: comment,
      score: score
    })
    .then(() => {
      alert('✅ Vote enregistré avec succès !')
      setSelectedProfessor(null)
      setComment('')
      setScore(5)
      return api.get('api/professors/')
    })
    .then(res => setProfessors(res.data))
    .catch(err => console.error(err))
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>🗳️ Vote pour le meilleur professeur 🎓</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {professors.map(p => (
          <li key={p.id} style={{ marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>
            <h2>{p.name}</h2>
            <p><em>{p.description}</em></p>
            <p>⭐ Note moyenne : <strong>{p.moyenne_notes ?? 'Aucune note'}</strong></p>
            <p>📊 Nombre de votes : <strong>{p.nombre_votes}</strong></p>
            <button onClick={() => setSelectedProfessor(p.id)}>
              Voter pour {p.name}
            </button>
          </li>
        ))}
      </ul>

      {selectedProfessor && (
        <div style={{ marginTop: '2rem', borderTop: '2px dashed #ccc', paddingTop: '1rem' }}>
          <h2>
            Vous votez pour :{" "}
            <span style={{ color: '#007BFF' }}>
              {professors.find(p => p.id === selectedProfessor)?.name}
            </span>
          </h2>
          <label>
            Commentaire (optionnel) :<br />
            <textarea
              placeholder="Laissez un commentaire"
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows="3"
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            />
          </label>
          <br />
          <label>
            Note :
            <select
              value={score}
              onChange={e => setScore(parseInt(e.target.value))}
              style={{ marginLeft: '1rem' }}
            >
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{'⭐'.repeat(n)}</option>
              ))}
            </select>
          </label>
          <br /><br />
          <button onClick={handleVote} style={{ padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white' }}>
            ✅ Valider mon vote
          </button>
        </div>
      )}
    </div>
  )
}

export default App
