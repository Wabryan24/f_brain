import { useEffect, useState } from 'react'
import { api } from "../hooks/api.js"

function App() {
  const [professors, setProfessors] = useState([])
  const [selectedProfessor, setSelectedProfessor] = useState(null)
  const [comment, setComment] = useState('')

  useEffect(() => {
    api.get('api/professors/')
      .then(response => response.json())
      .then(response => setProfessors(response.data))
      .catch(error => console.error(error))
  }, [])

  const handleVote = () => {
    api.post('api/votes/', {
      professor: selectedProfessor,
      comment: comment,
    })
    .then(() => alert('Vote enregistré !'))
    .catch(err => console.error(err))
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Vote pour le meilleur professeur 🎓</h1>
      <ul>
        {professors.map(p => (
          <li key={p.id}>
            <strong>{p.name}</strong><br />
            <em>{p.description}</em><br />
            <button onClick={() => setSelectedProfessor(p.id)}>
              Voter pour {p.name}
            </button>
          </li>
        ))}
      </ul>
      {selectedProfessor && (
        <div style={{ marginTop: '1rem' }}>
          <textarea
            placeholder="Laissez un commentaire (optionnel)"
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <br />
          <button onClick={handleVote}>Valider mon vote</button>
        </div>
      )}
    </div>
  )
}

export default App
