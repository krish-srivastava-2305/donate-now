'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ExpandableCard } from '@/components/Cards'

type ItemType = {
  name: string,
  description: string,
  image?: string,
  donor: string
  _id: string
}

function ProductPage() {
  const [items, setItems] = useState<ItemType[]>([])
  const [filteredItems, setFilteredItems] = useState<ItemType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const dataFetch = async () => {
      try {
        const res = await axios.get('/api/donations/show-all')
        const allItems = res.data.donations
        setItems(allItems)
        setFilteredItems(allItems)
      } catch (err) {
        setError('Failed to fetch items')
      } finally {
        setLoading(false)
      }
    }
    dataFetch()
  }, [])

  useEffect(() => {
    const newItems = items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredItems(newItems)
  }, [searchTerm, items])

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>
  }

  return (
    <div className='min-h-screen w-full flex bg-[#e0d8c4] flex-col'>
      <header className='w-full h-28 border-b-2 border-b-black flex justify-start items-center fixed top-0 left-0 z-10 bg-[#e0d8c4]'>
        <h1 className='text-4xl p-4 font-bold text-amber-900'>
          DonateNow
        </h1>
      </header>
      
      <main className='flex mt-20 p-8 pt-16'>
        <div className='w-full pr-8'>
          <div className='mb-4'>
            <input 
              type='text' 
              placeholder='Search items...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full p-2 border-2 border-gray-300 rounded-3xl'
            />
          </div>
          <p className='p-3 text-lg font-semibold'>
            All Products {searchTerm && `/ Search: "${searchTerm}"`}
          </p>
          <ExpandableCard cards={filteredItems} images={true} />
        </div>
      </main>
    </div>
  )
}

export default ProductPage