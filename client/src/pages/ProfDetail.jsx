// src/pages/ProfDetail.jsx
import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { api } from "../hooks/api"

const COLORS = ["#00C49F", "#FF8042"]

export default function ProfDetail() {
  const { id } = useParams()
  const [prof, setProf] = useState(null)

  useEffect(() => {
    api.get(`/api/professors/${id}/`).then(res => {
      setProf(res.data)
    })
  }, [id])

  if (!prof) return <p>Chargement du professeur...</p>

  const chartData = [
    { name: "Votes", value: prof.nombre_votes },
    { name: "Non Votes", value: 100 - prof.nombre_votes },
  ]

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Détails pour {prof.name}</h1>
      <p><em>{prof.description}</em></p>
      <p>⭐ Note moyenne : <strong>{prof.moyenne_notes ?? 'Aucune note'}</strong></p>
      <p>📊 Nombre de votes : <strong>{prof.nombre_votes}</strong></p>

      <PieChart width={400} height={300}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      <Link to="/" style={{ marginTop: '1rem', display: 'inline-block' }}>← Retour</Link>
    </div>
  )
}
