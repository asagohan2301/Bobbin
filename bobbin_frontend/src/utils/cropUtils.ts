import { type PixelCrop } from 'react-image-crop'

export const getCroppedImg = (
  image: HTMLImageElement,
  crop: PixelCrop,
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('画像のトリミングに失敗しました'))
      return
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    )

    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error('画像のトリミングに失敗しました'))
      }
    }, 'image/jpeg')
  })
}
