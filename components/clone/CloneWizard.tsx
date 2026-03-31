'use client'

import React, { useState } from 'react'
import { CloneUploadZone } from './CloneUploadZone'
import { CloneDisclaimerModal } from './CloneDisclaimerModal'
import { CloneAnalysisLoader } from './CloneAnalysisLoader'
import { CloneResult } from './CloneResult'
import { Button } from '../ui/Button'
import styles from './CloneWizard.module.scss'
import toast from 'react-hot-toast'

export function CloneWizard() {
  const [file, setFile] = useState<File | null>(null)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [resultPrompt, setResultPrompt] = useState<string | null>(null)

  const handleFileSelect = (selected: File) => {
    setFile(selected)
  }

  const handleStartClone = () => {
    if (!file) return
    setShowDisclaimer(true)
  }

  const acceptDisclaimerAndAnalyze = async () => {
    setShowDisclaimer(false)
    setIsAnalyzing(true)

    // Simulando a chamada para a API (Vision)
    try {
      // const formData = new FormData()
      // formData.append('image', file!)
      // const res = await fetch('/api/clone', { method: 'POST', body: formData })
      // const data = await res.json()
      
      setTimeout(() => {
        setResultPrompt("Fotografia editorial de moda feminina, mulher 30 anos sorrindo, luz do sol suave pela janela, paleta de cores neutras e tons pastéis quentes, estilo minimalista cinemático, filmado em 35mm, alta resolução --v 6.0")
        setIsAnalyzing(false)
      }, 8000) // Match the loader duration
    } catch (err) {
      toast.error('Erro na análise da imagem.')
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setResultPrompt(null)
  }

  return (
    <div className={styles.wizardContainer}>
      <div className={styles.header}>
        <h2>Clonagem Mágica de Criativos (Pro)</h2>
        <p>Faça upload de um design ou foto que você ama. A IA reverterá a imagem em um Prompt perfeito para você usar.</p>
      </div>

      {!isAnalyzing && !resultPrompt && (
        <div className={styles.uploadStep}>
          <CloneUploadZone onFileSelect={handleFileSelect} />
          
          <div className={styles.actions}>
            <Button 
              type="button" 
              onClick={handleStartClone} 
              disabled={!file}
              className={styles.analyzeBtn}
            >
              Analisar e Extrair Prompt
            </Button>
          </div>
        </div>
      )}

      {isAnalyzing && (
        <CloneAnalysisLoader />
      )}

      {resultPrompt && !isAnalyzing && (
        <CloneResult promptText={resultPrompt} onReset={handleReset} />
      )}

      <CloneDisclaimerModal 
        isOpen={showDisclaimer} 
        onAccept={acceptDisclaimerAndAnalyze}
        onDecline={() => setShowDisclaimer(false)}
      />
    </div>
  )
}
