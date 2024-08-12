'use client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

function Page() {
    const router = useRouter()
    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const signOut = async () => {
            try {
                const res = await axios.get('/api/user/signout')
                if (res.status === 200) {
                    toast.success('SignOut Success')
                    router.push('/')
                } else {
                    setError('Error Signing Out')
                }
            } catch (error) {
                setError('Error Signing Out')
                console.error('SignOut Error:', error)
            } finally {
                setLoading(false)
            }
        }
        signOut()
    }, [router])

    return (
        <div className="flex justify-center items-center h-screen text-lg bg-gradient-to-r from-[#e0d8c4] via-[#786f57] to-[#59513b]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#e0d8c4] via-[#786f57] to-[#59513b] opacity-70 blur-xl"></div>
            <div className="relative z-10 text-white">
                {loading ? 'Signing Out...' : error}
            </div>
        </div>
    )
}

export default Page
