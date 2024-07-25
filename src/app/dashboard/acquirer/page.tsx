'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { toast, Toaster } from 'react-hot-toast'

type UserDetails = {
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  imageUrl?: string,
  donated: boolean,
  isDonor: boolean
}

type RequestDetail = {
  _id: string,
  name: string,
  description: string
}

export default function AcquirerDashboard() {
  const router = useRouter()
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [requestDetails, setRequestDetails] = useState<RequestDetail[] | null>(null)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [reload, setReload] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get('/api/user/dashboard-details');
        setUserDetails(userRes.data.details);

        const reqRes = await axios.get("/api/requests/get-user-requests")
        setRequestDetails(reqRes.data.reqData)
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch data.");
        setLoading(false);
      }
    }
    fetchData()
  }, [reload])

  const deleteRequest = async (reqId: string) => {
    try {
      await axios.delete(`/api/requests/delete`, { data: { reqId } });
      setRequestDetails((prevDetails) => prevDetails?.filter(req => req._id !== reqId) || null);
      toast.success("Request deleted successfully!");
    } catch (error) {
      console.error("Error deleting request ", error);
      toast.error("Error deleting request");
    }
  }

  const createRequest = async () => {
    try {
      const res = await axios.post("/api/requests/create", { name, description });
      if (res.status === 200) {
        toast.success("Request Uploaded!");
        setFormVisible(false);
        setName('');
        setDescription('');
        setRequestDetails((prevDetails) => [...(prevDetails || []), res.data.reqData]);
      }
    } catch (error) {
      console.error("Error creating request ", error);
      toast.error("Error creating request");
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
    <div className='bg-[#e0d8c4] min-h-screen'>
      <Toaster />
      <div className="container mx-auto p-4 bg-[#e0d8c4]">
        <h1 className="text-3xl font-bold mb-8 text-center">User Dashboard</h1>
        <div className="shadow-md rounded-lg p-6 mb-6 bg-[#c9c4b5]">
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
        <h2 className="text-2xl font-bold mb-8 text-center">Request Details</h2>

        <button
          onClick={() => setFormVisible((prev) => !prev)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {formVisible ? 'Hide Form' : 'Add Request'}
        </button>

        {formVisible && (
          <form
            className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md"
            onSubmit={(e) => {
              e.preventDefault();
              createRequest();
            }}
          >
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Name</label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Description</label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Create Request
              </button>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => setFormVisible(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {requestDetails? requestDetails?.map((req) => (
            <div key={req?._id} className="bg-[#c9c4b5] shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold">{req?.name}</h3>
              <p className="text-gray-600">{req?.description}</p>
              <button
                onClick={() => deleteRequest(req._id)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          )) : "No Requests"}
        </div>
      </div>
    </div>
  )
}
