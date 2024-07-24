'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

type UserDetails = {
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  imageUrl?: string,
  donated: boolean,
  isDonor: boolean
}

function AcquirerDashboard() {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/user/dashboard-details');
        setUserDetails(res.data.details);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch user details.");
        setLoading(false);
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center mb-4">
          {userDetails?.imageUrl && (
            <img src={userDetails.imageUrl} alt="User Image" className="w-16 h-16 rounded-full mr-4" />
          )}
          <div>
            <h2 className="text-xl font-semibold">{userDetails?.firstName} {userDetails?.lastName}</h2>
            <p className="text-gray-600">@{userDetails?.username}</p>
          </div>
        </div>
        <div>
          <p className="mb-2"><strong>Email:</strong> {userDetails?.email}</p>
          <p className="mb-2"><strong>Donated:</strong> {userDetails?.donated ? 'Yes' : 'No'}</p>
          <p className="mb-2"><strong>Is Donor:</strong> {userDetails?.isDonor ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  )
}

export default AcquirerDashboard
