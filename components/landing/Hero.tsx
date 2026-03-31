// components/landing/Hero.tsx
'use client'

import React from 'react'
import { motion, type Variants } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Button } from '../ui/Button'
import styles from './Hero.module.scss'

export const Hero = () => {
  const t = useTranslations('Index')

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: 'spring', 
        stiffness: 100 
      } 
    },
  }

  return (
    <motion.section 
      className={styles.hero}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 className={styles.title} variants={itemVariants}>
        CRIE SEUS <br />
        <span className={styles.accent}>PROMPTS</span> <br />
        VIA IA.
      </motion.h1>
      
      <motion.p className={styles.description} variants={itemVariants}>
        {t('description')}
      </motion.p>
      
      <motion.div className={styles.actions} variants={itemVariants}>
        <Button variant="primary" style={{ minWidth: '200px' }}>
          {t('cta')}
        </Button>
        <Button variant="outline">
          VER DEMO
        </Button>
      </motion.div>
    </motion.section>
  )
}
