'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const type = searchParams.get('type')
    if (type !== 'recovery') {
      setMessage('Este enlace no es válido o ha expirado.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Contraseña actualizada correctamente. Redirigiendo...')
      setTimeout(() => router.push('/auth/login'), 3000)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Establecer nueva contraseña
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button 
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Actualizar contraseña
          </button>
        </form>
        {message && (
          <p className="text-center text-sm text-gray-600">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
