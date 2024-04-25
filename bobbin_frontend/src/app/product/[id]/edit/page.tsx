'use client'

import type { Params } from '@/types/routeTypes'

export default function Edit({ params }: { params: Params }) {
  return (
    <div>
      <p>製品ID {params.id} の編集ページ</p>
    </div>
  )
}
