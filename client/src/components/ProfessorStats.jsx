import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { api } from '../hooks/api.js'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

function ProfessorStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/professors/stats/')
      console.log('Stats data:', response.data)
      setStats(response.data)
    } catch (err) {
      setError('Erreur lors du chargement des statistiques')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</div>
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>
  if (!stats) return <div style={{ textAlign: 'center', padding: '2rem' }}>Aucune donnée</div>

  // Données pour le graphique en camembert (pourcentages)
  const pieData = stats.professors
    .filter(prof => prof.nombre_votes > 0)
    .map(prof => ({
      name: prof.name,
      value: prof.pourcentage_votes,
      votes: prof.nombre_votes
    }))

  // Données pour le graphique en barres (notes moyennes)
  const barData = stats.professors
    .filter(prof => prof.moyenne_notes > 0)
    .map(prof => ({
      name: prof.name.length > 15 ? prof.name.substring(0, 15) + '...' : prof.name,
      note: prof.moyenne_notes,
      votes: prof.nombre_votes
    }))

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>📊 Dashboard - Résultats des votes</h1>
        <button 
          onClick={() => window.location.href = '/'} 
          style={{ padding: '0.5rem 1rem', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          ← Retour au vote
        </button>
      </div>

      {/* Statistiques globales */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#007BFF' }}>Total des votes</h3>
          <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold' }}>{stats.global_stats.total_votes}</p>
        </div>
        <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#28a745' }}>Professeurs</h3>
          <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold' }}>{stats.global_stats.total_professors}</p>
        </div>
        <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#ffc107' }}>Moyenne votes/prof</h3>
          <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold' }}>{stats.global_stats.average_votes_per_professor}</p>
        </div>
      </div>

      {/* Graphiques */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* Graphique en camembert - Répartition des votes */}
        <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Répartition des votes (%)</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Pourcentage']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ textAlign: 'center', color: '#666' }}>Aucun vote pour le moment</p>
          )}
        </div>

        {/* Graphique en barres - Notes moyennes */}
        <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Notes moyennes (/5)</h2>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip formatter={(value) => [`${value}/5`, 'Note moyenne']} />
                <Bar dataKey="note" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ textAlign: 'center', color: '#666' }}>Aucune note pour le moment</p>
          )}
        </div>
      </div>

      {/* Tableau détaillé */}
      <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2>Détails par professeur</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #ddd' }}>Professeur</th>
              <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #ddd' }}>Matière</th>
              <th style={{ padding: '1rem', textAlign: 'center', border: '1px solid #ddd' }}>Votes</th>
              <th style={{ padding: '1rem', textAlign: 'center', border: '1px solid #ddd' }}>Note moyenne</th>
              <th style={{ padding: '1rem', textAlign: 'center', border: '1px solid #ddd' }}>% des votes</th>
            </tr>
          </thead>
          <tbody>
            {stats.professors.map(prof => (
              <tr key={prof.id}>
                <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{prof.name}</td>
                <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{prof.subject}</td>
                <td style={{ padding: '1rem', textAlign: 'center', border: '1px solid #ddd' }}>{prof.nombre_votes}</td>
                <td style={{ padding: '1rem', textAlign: 'center', border: '1px solid #ddd' }}>
                  {prof.moyenne_notes ? `${prof.moyenne_notes}/5 ⭐` : 'Aucune note'}
                </td>
                <td style={{ padding: '1rem', textAlign: 'center', border: '1px solid #ddd' }}>{prof.pourcentage_votes}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProfessorStats