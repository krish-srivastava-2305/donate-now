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

type DonationDetail = {
  _id: string,
  name: string,
  image: string,
  description: string
}

function AcquirerDashboard() {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [donationDetails, setDonationDetails] = useState<DonationDetail[] | null>(null)
  const [deleteDonationId, setDeleteDonationId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get('/api/user/dashboard-details');
        setUserDetails(userRes.data.details);

        const donationsRes = await axios.get("/api/donations/show")
        setDonationDetails(donationsRes.data.donationData)

        setLoading(false);
      } catch (error) {
        setError("Failed to fetch data.");
        setLoading(false);
      }
    }
    fetchData()
  }, [])

  const deleteDonation = async (donationId: string) => {
    try {
        await axios.delete(`/api/donations/delete`, { data: { donationId } });
        setDonationDetails((prevDetails) => prevDetails?.filter(donation => donation._id !== donationId) || null);
    } catch (error) {
        console.error("Error deleting donation ", error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-gray-600" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <i className="fas fa-exclamation-circle mr-2"></i>
        {error}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">User Dashboard</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          {userDetails?.imageUrl && (
            <img
              src={userDetails.imageUrl}
              alt="User Image"
              className="w-20 h-20 rounded-full mr-4 border-2 border-gray-200"
            />
          )}
          <div>
            <h2 className="text-2xl font-semibold">{userDetails?.firstName} {userDetails?.lastName}</h2>
            <p className="text-gray-600">@{userDetails?.username}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="mb-2">
              <strong>Email:</strong> {userDetails?.email}
            </p>
            <p className="mb-2">
              <strong>Donated:</strong> {userDetails?.donated ? 'Yes' : 'No'}
            </p>
          </div>
          <div>
            <p className="mb-2">
              <strong>Is Donor:</strong> {userDetails?.isDonor ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-8 text-center">Donation Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donationDetails?.map((donation) => (
          <div key={donation._id} className="bg-white shadow-md rounded-lg p-4">
            <img
              src={donation.image}
              alt={donation.name}
              className="w-full h-60 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold">{donation.name}</h3>
            <p className="text-gray-600">{donation.description}</p>
            <button
              onClick={() => deleteDonation(donation._id)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AcquirerDashboard
