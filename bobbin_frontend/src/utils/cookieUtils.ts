'use server'

import { cookies } from 'next/headers'

export async function setCookie(name: string, value: string) {
  cookies().set(name, value)
}

export async function getCookie(name: string) {
  const obj = cookies().get(name)
  if (obj) {
    return obj.value
  }
}

export async function deleteCookie(name: string) {
  cookies().delete(name)
}
