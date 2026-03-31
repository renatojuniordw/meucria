'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react'
import styles from './CloneUploadZone.module.scss'

interface CloneUploadZoneProps {
  onFileSelect: (file: File) => void
  disabled?: boolean
}

export function CloneUploadZone({ onFileSelect, disabled }: CloneUploadZoneProps) {
  const [preview, setPreview] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        setPreview(URL.createObjectURL(file))
        onFileSelect(file)
      }
    },
    [onFileSelect]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB limit
    disabled,
  })

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
    // Needs parent communication to clear file in the real app,
    // assuming here it acts as just a visual reset before triggering a new drop
  }

  if (preview) {
    return (
      <div className={styles.previewContainer}>
        <img src={preview} alt="Preview da imagem" className={styles.previewImage} />
        <button type="button" onClick={clearFile} className={styles.removeBtn} disabled={disabled}>
          <X size={16} /> Trocar Imagem
        </button>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={`${styles.dropzone} ${isDragActive ? styles.active : ''} ${disabled ? styles.disabled : ''}`}
    >
      <input {...getInputProps()} />
      <div className={styles.content}>
        <UploadCloud size={40} className={styles.icon} />
        <p className={styles.title}>
          {isDragActive ? 'Solte a imagem aqui...' : 'Arraste uma imagem de referência'}
        </p>
        <span className={styles.subtitle}>Ou clique para buscar no seu dispositivo</span>
        <div className={styles.badges}>
          <span className={styles.badge}><ImageIcon size={12} /> JPG, PNG, WEBP</span>
          <span className={styles.badge}>Max 5MB</span>
        </div>
      </div>
    </div>
  )
}
