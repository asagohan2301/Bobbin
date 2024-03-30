'use client'

import { useEffect, useState } from 'react'

type Params = {
  id: string
}

export default function Product({ params }: { params: Params }) {
  const [imageUrls, setImageUrls] = useState<string[]>([])

  useEffect(() => {
    console.log(params)
    fetch(`http://localhost:3001/api/products/${params.id}`)
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        setImageUrls(data.image_urls)
      })
  }, [])

  return (
    <div>
      <h1>製品詳細</h1>
      {imageUrls &&
        imageUrls.map((imageUrl, index) => {
          return <img src={imageUrl} alt="" key={index} />
        })}
    </div>
  )
}
