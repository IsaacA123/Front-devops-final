import { useEffect, useState } from 'react'
import { Pencil, Check } from 'lucide-react'

export default function ProfileEditor() {
  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    password: false,
  })
  const [profile, setProfile] = useState({
    name: localStorage.getItem('userName') || '',
    email: localStorage.getItem('email') || '',
    newPassword: ''
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error("Token no encontrado. Redirigir a login.")
    }
  }, [])

  const handleEditToggle = (field: keyof typeof isEditing) => {
    setIsEditing(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const userId = localStorage.getItem('IdUser')

    try {
      const response = await fetch(`http://localhost:4000/api/auth/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          nombre: profile.name,
          email: profile.email,
          password: profile.newPassword
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Usuario actualizado:', data)

        localStorage.setItem('userName', profile.name)
        localStorage.setItem('email', profile.email)

        setIsEditing({ name: false, email: false, password: false })
        setProfile({ ...profile, newPassword: '' })
      } else {
        const errorData = await response.json()
        console.error("Error al actualizar el usuario:", errorData)
      }
    } catch (error) {
      console.error("Error de red:", error)
    }
  }

  return (
    <main>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Configuacion de perfil de Usuario</h1>
        <p className="text-gray-600">
          Cambien luego este texto que no se me ocurre que poner
        </p>
      </div>
      <div className="w-full max-w-sm mx-auto p-6 bg-white shadow-xl rounded-3xl border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Editar Perfil</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Nombre */}
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500">Nombre</label>
              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                disabled={!isEditing.name}
                className={`w-full text-lg font-medium text-gray-900 bg-gray-100 rounded-lg p-3 border ${isEditing.name ? 'border-indigo-300' : 'border-transparent'} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              />
            </div>
            <button
              type="button"
              onClick={() => handleEditToggle('name')}
              className="p-2 text-indigo-500 hover:text-indigo-700 focus:outline-none"
            >
              {isEditing.name ? <Check className="h-5 w-5" /> : <Pencil className="h-5 w-5" />}
            </button>
          </div>

          {/* Email */}
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500">Email</label>
              <input
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                disabled={!isEditing.email}
                className={`w-full text-lg font-medium text-gray-900 bg-gray-100 rounded-lg p-3 border ${isEditing.email ? 'border-indigo-300' : 'border-transparent'} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              />
            </div>
            <button
              type="button"
              onClick={() => handleEditToggle('email')}
              className="p-2 text-indigo-500 hover:text-indigo-700 focus:outline-none"
            >
              {isEditing.email ? <Check className="h-5 w-5" /> : <Pencil className="h-5 w-5" />}
            </button>
          </div>

          {/* Nueva Contraseña */}
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500">Nueva Contraseña</label>
              <input
                name="newPassword"
                type="password"
                value={profile.newPassword}
                onChange={handleChange}
                disabled={!isEditing.password}
                placeholder="Ingrese nueva contraseña"
                className={`w-full p-3 text-lg font-medium bg-gray-100 rounded-lg border ${isEditing.password ? 'border-indigo-300' : 'border-transparent'} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              />
            </div>
            <button
              type="button"
              onClick={() => handleEditToggle('password')}
              className="p-2 text-indigo-500 hover:text-indigo-700 focus:outline-none"
            >
              {isEditing.password ? <Check className="h-5 w-5" /> : <Pencil className="h-5 w-5" />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </main>
  )
}
