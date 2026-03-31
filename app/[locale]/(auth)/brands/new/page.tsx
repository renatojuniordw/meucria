'use client'

import React, { useState } from 'react'
import { BrandForm } from '@/components/brand/BrandForm'
import { useRouter } from '@/i18n/routing'
import { BrandCreate } from '@/lib/validations/brand.schema'
import styles from '../brands.module.scss'
import toast from 'react-hot-toast'

export default function NewBrandPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: BrandCreate) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error('Falha ao criar marca: ' + JSON.stringify(errData.details))
      }

      toast.success('Marca criada com sucesso!')
      router.push('/brands')
      router.refresh()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao conectar ao servidor')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Nova Marca</h1>
        <p>Cadastre uma nova marca para gerar criativos personalizados.</p>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <BrandForm 
          onSubmitData={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  )
}
