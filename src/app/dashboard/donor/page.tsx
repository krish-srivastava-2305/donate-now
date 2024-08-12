'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { toast, Toaster } from 'react-hot-toast'
import Link from 'next/link'

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

export default function DonorDashboard() {
  const router = useRouter()
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [donationDetails, setDonationDetails] = useState<DonationDetail[] | null>(null)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [reload, setReload] = useState<boolean>(false)
  const [file, setFile] = useState<File | null>(null)
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
  }, [reload])

  const deleteDonation = async (donationId: string) => {
    try {
      await axios.delete(`/api/donations/delete`, { data: { donationId } });
      setDonationDetails((prevDetails) => prevDetails?.filter(donation => donation._id !== donationId) || null);
      toast.success("Donation deleted successfully!");
    } catch (error) {
      console.error("Error deleting donation ", error);
      toast.error("Error deleting donation");
    }
  }

  const createDonation = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      const res = await axios.post("/api/donations/create", { name, description });
      if (res.status === 200) {
        toast.success("Uploading Image!");
        setFormVisible(false);
        setName('');
        setDescription('');
        setFile(null);
        setDonationDetails((prevDetails) => [...(prevDetails || []), res.data.donation]);
      }

      const formData = new FormData();
      formData.append('file', file);

      const localUploadRes = await axios.post('/api/local/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (localUploadRes.data.status === 201) {
        toast.success("File uploaded successfully!");
        const { filename } = localUploadRes.data;
        console.log("filename: ", filename);

        const cloudinaryRes = await axios.post("/api/cloudinary/donation-image", { fileUri: `D:\\Projects\\innovate-new\\public\\assets\\${filename}`, donationId: res.data.donation._id });
        setReload((prev) => !prev);

        if (cloudinaryRes.status === 200) {
          toast.success("File Uploaded");

          await axios.delete(`/api/local/delete?filename=${filename}`);
          // toast.success("Local file deleted!");
        }
      }
    } catch (error) {
      console.error("Error creating donation ", error);
      toast.error("Error creating donation");
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
    <>
      <Toaster />
      <div className="container mx-auto p-4 bg-[#e0d8c4]">
      <div className='flex w-full p-4 justify-between items-center'>
          <h1 className="text-3xl font-bold mb-8 text-center">User Dashboard</h1>
          <Link href={'/requests'} className="bg-blue-500 h-10 text-white px-4 py-2 rounded hover:bg-blue-600" >Requests</Link>
        </div>
        <div className="shadow-md rounded-lg p-6 mb-6 bg-[#c9c4b5]">
          <div className="flex items-center mb-4">
            {/* {userDetails?.imageUrl && (
              <img
                src={userDetails.imageUrl}
                alt="User Image"
                className="w-20 h-20 rounded-full mr-4 border-2 border-gray-200"
              />
            )} */}
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

        <button
          onClick={() => setFormVisible((prev) => !prev)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {formVisible ? 'Hide Form' : 'Add Donation'}
        </button>

        {formVisible && (
          <form
            className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md"
            onSubmit={(e) => {
              e.preventDefault();
              createDonation();
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
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Image</label>
              <input
                type="file"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Create Donation
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
          {donationDetails?.map((donation) => (
            <div key={donation._id} className="bg-[#c9c4b5] shadow-md rounded-lg p-4">
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
    </>
  )
}
