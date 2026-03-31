import styles from './Skeletons.module.scss'

export function SkeletonCard() {
  return <div className={`${styles.skeleton} ${styles.card}`} />
}

export function SkeletonInput() {
  return <div className={`${styles.skeleton} ${styles.input}`} />
}

export function SkeletonWizard() {
  return (
    <div className={styles.wizard}>
      <div className={`${styles.skeleton} ${styles.header}`} />
      <div className={`${styles.skeleton} ${styles.input}`} />
      <div className={`${styles.skeleton} ${styles.input}`} />
      <div className={`${styles.skeleton} ${styles.input}`} />
      <div className={`${styles.skeleton} ${styles.button}`} />
    </div>
  )
}

export function SkeletonHistory() {
  return (
    <div className={styles.history}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={`${styles.skeleton} ${styles.row}`} />
      ))}
    </div>
  )
}
