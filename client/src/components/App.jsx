import { useEffect, useState } from 'react'
import { api } from "../hooks/api.js"

function App() {
  const [professors, setProfessors] = useState([])
  const [selectedProfessor, setSelectedProfessor] = useState(null)
  const [comment, setComment] = useState('')
  const [score, setScore] = useState(5)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)

  useEffect(() => {
    fetchProfessors()
  }, [])

  const fetchProfessors = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/professors/')
      console.log('Professors data:', response.data)
      setProfessors(response.data)
    } catch (error) {
      setError('Erreur lors du chargement des professeurs')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async () => {
    if (!selectedProfessor) {
      alert("Sélectionnez un professeur.")
      return
    }

    try {
      setSubmitLoading(true)
      
      await api.post('votes/', {
        professor: selectedProfessor,
        comment: comment.trim(),
        score: score
      })

      
      alert('✅ Vote enregistré avec succès !')
      
      // Reset du formulaire
      setSelectedProfessor(null)
      setComment('')
      setScore(5)
      
      // Actualiser la liste des professeurs
      await fetchProfessors()
      
    } catch (err) {
      console.error('Erreur vote:', err)
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors
        if (errors.non_field_errors) {
          alert(`❌ ${errors.non_field_errors[0]}`)
        } else {
          alert('❌ Erreur lors du vote. Vérifiez vos données.')
        }
      } else {
        alert('❌ Erreur lors du vote. Réessayez plus tard.')
      }
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</div>
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>🗳️ Vote pour le meilleur professeur 🎓</h1>
        <button 
          onClick={() => window.location.href = '/dashboard'} 
          style={{ padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          📊 Voir les résultats
        </button>
      </div>

      {/* Liste des professeurs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {professors.map(p => (
          <div key={p.id} style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '1rem',
            backgroundColor: selectedProfessor === p.id ? '#e7f3ff' : 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{p.name}</h3>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>
              📚 <strong>{p.subject}</strong>
            </p>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
              <em>{p.description}</em>
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span>⭐ Note: <strong>{p.moyenne_notes ? `${p.moyenne_notes}/5` : 'Aucune'}</strong></span>
              <span>📊 Votes: <strong>{p.nombre_votes}</strong></span>
            </div>
            
            <button 
              onClick={() => setSelectedProfessor(p.id)}
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                backgroundColor: selectedProfessor === p.id ? '#007BFF' : '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {selectedProfessor === p.id ? '✅ Sélectionné' : `Voter pour ${p.name}`}
            </button>
          </div>
        ))}
      </div>

      {/* Formulaire de vote */}
      {selectedProfessor && (
        <div style={{ 
          marginTop: '2rem', 
          border: '2px solid #007BFF', 
          borderRadius: '8px',
          padding: '1.5rem',
          backgroundColor: '#f8f9fa'
        }}>
          <h2 style={{ color: '#007BFF', marginBottom: '1rem' }}>
            Vous votez pour : {professors.find(p => p.id === selectedProfessor)?.name}
          </h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Commentaire (optionnel) :
            </label>
            <textarea
              placeholder="Partagez votre expérience avec ce professeur..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows="4"
              maxLength="500"
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
            <small style={{ color: '#666' }}>{comment.length}/500 caractères</small>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Note :
            </label>
            <select
              value={score}
              onChange={e => setScore(parseInt(e.target.value))}
              style={{ 
                padding: '0.5rem', 
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            >
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>
                  {n} {'⭐'.repeat(n)} {n === 1 ? '- Très insatisfait' : n === 2 ? '- Insatisfait' : n === 3 ? '- Neutre' : n === 4 ? '- Satisfait' : '- Très satisfait'}
                </option>
              ))}
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={handleVote} 
              disabled={submitLoading}
              style={{ 
                padding: '0.75rem 1.5rem', 
                backgroundColor: submitLoading ? '#ccc' : '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: submitLoading ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              {submitLoading ? '⏳ Envoi...' : '✅ Valider mon vote'}
            </button>
            
            <button 
              onClick={() => {
                setSelectedProfessor(null)
                setComment('')
                setScore(5)
              }}
              style={{ 
                padding: '0.75rem 1.5rem', 
                backgroundColor: '#6c757d', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App