import React from 'react'
import { useAuth } from "../auth/AuthContext.jsx";


const AdminNavbar = () => {
      const { user, logout } = useAuth();

  return (
    <>
     <div className='bg-black text-white'>
        <header className="border-b border-white/10 bg-black/60 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
    
              <div>
                <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                <p className="text-sm text-gray-400">Logged in as {user?.email}</p>
              </div>
    
              <button
                onClick={logout}
                className="rounded-lg bg-red-500/90 px-4 py-2 text-sm font-medium hover:bg-red-500"
              >
                Logout
              </button>
            </div>
          </header>
     </div>
          </>
  )
}

export default AdminNavbar