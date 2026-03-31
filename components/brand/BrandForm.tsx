'use client'

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BrandCreateSchema, type BrandCreate } from '@/lib/validations/brand.schema'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { ColorPicker, type ColorMode, type BrandColors } from './ColorPicker'
import { FontPicker, type FontMode, type BrandFonts } from './FontPicker'
import { NicheSelector } from './NicheSelector'
import styles from './BrandForm.module.scss'
import toast from 'react-hot-toast'

interface BrandFormProps {
  initialData?: Partial<BrandCreate>
  onSubmitData: (data: BrandCreate) => Promise<void>
  isSubmitting?: boolean
}

export function BrandForm({ initialData, onSubmitData, isSubmitting = false }: BrandFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BrandCreate>({
    resolver: zodResolver(BrandCreateSchema),
    defaultValues: {
      name: initialData?.name || '',
      niche: initialData?.niche || '',
      description: initialData?.description || '',
      color_mode: initialData?.color_mode || 'ai',
      colors: initialData?.colors || undefined,
      font_mode: initialData?.font_mode || 'ai',
      fonts: initialData?.fonts || undefined,
    },
  })

  // Watchers to pass to subcomponents
  const colorMode = watch('color_mode') as ColorMode
  const colors = watch('colors') as BrandColors | undefined
  const fontMode = watch('font_mode') as FontMode
  const fonts = watch('fonts') as BrandFonts | undefined
  const niche = watch('niche')
  const description = watch('description')

  const submitHandler = async (data: BrandCreate) => {
    try {
      await onSubmitData(data)
    } catch (error) {
      console.error(error)
      toast.error('Ocorreu um erro ao salvar a marca.')
    }
  }

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit(submitHandler)}>
      {/* 1. Nome da Marca */}
      <div className={styles.formGroup}>
        <label>Nome do Negócio / Marca *</label>
        <Input 
          {...register('name')} 
          placeholder="Ex: Boutique Alma" 
          error={errors.name?.message}
        />
      </div>

      <div className={styles.grid2}>
        {/* 2. Nicho */}
        <div className={styles.formGroup}>
          <label>Nicho / Segmento</label>
          <Controller
            name="niche"
            control={control}
            render={({ field }) => (
              <NicheSelector 
                value={field.value || ''} 
                onChange={field.onChange} 
                onBlur={field.onBlur}
                error={errors.niche?.message}
              />
            )}
          />
        </div>

        {/* 3. Descrição */}
        <div className={styles.formGroup}>
          <label>Breve Descrição (Opcional mas recomendado)</label>
          <Input 
            {...register('description')} 
            placeholder="Ex: Roupas femininas para mulheres modernas." 
            error={errors.description?.message}
          />
        </div>
      </div>

      <hr className={styles.divider} />

      {/* 4. Cores */}
      <div className={styles.formSection}>
        <div className={styles.sectionHeader}>
          <h3>Cores da Marca</h3>
          <p>Como a IA deve considerar as cores nas suas imagens?</p>
        </div>
        
        <ColorPicker 
          mode={colorMode || 'ai'}
          colors={colors || { primary: '', secondary: '', accent: '' }}
          niche={niche}
          description={description}
          onChangeMode={(mode) => setValue('color_mode', mode)}
          onChangeColors={(newColors) => setValue('colors', newColors)}
        />
        {errors.colors?.primary && <span className={styles.errorText}>Preencha todas as cores ou escolha outro modo.</span>}
      </div>

      <hr className={styles.divider} />

      {/* 5. Fontes */}
      <div className={styles.formSection}>
        <div className={styles.sectionHeader}>
          <h3>Tipografia e Fontes</h3>
          <p>Qual o tom dos textos inseridos nos seus criativos?</p>
        </div>

        <FontPicker
          mode={fontMode || 'ai'}
          fonts={fonts || {}}
          onChangeMode={(mode) => setValue('font_mode', mode)}
          onChangeFonts={(newFonts) => setValue('fonts', newFonts)}
        />
      </div>

      <div className={styles.formActions}>
        <Button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
          {isSubmitting ? 'Salvando...' : 'Salvar Marca'}
        </Button>
      </div>
    </form>
  )
}
