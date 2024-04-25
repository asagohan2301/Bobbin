'use client'

import ButtonWithIcon from '@/components/ButtonWithIcon'
import { destroyProduct } from '@/services/productService'
import type { Params } from '@/types/routeTypes'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Trash3 } from 'react-bootstrap-icons'

export default function Edit({ params }: { params: Params }) {
  const router = useRouter()
  const [errorMessages, setErrorMessages] = useState<string[]>([])

  return (
    <div>
      <p>製品ID {params.id} の編集ページ</p>
      <ButtonWithIcon
        IconComponent={Trash3}
        label="削除"
        onClick={() => {
          destroyProduct(params.id)
            .then(() => {
              router.push('/')
            })
            .catch((error) => {
              setErrorMessages(error.message.split(','))
            })
        }}
      />
    </div>
  )
}
