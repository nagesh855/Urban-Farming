import { useEffect, useState } from 'react'

function OpeningTransition({ active }) {
  const [isComplete, setIsComplete] = useState(() => (
    !active || window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ))

  useEffect(() => {
    if (!active || isComplete) return undefined

    const fallback = window.setTimeout(() => setIsComplete(true), 1600)
    return () => window.clearTimeout(fallback)
  }, [active, isComplete])

  if (isComplete) return null

  return (
    <div className="opening-transition" aria-hidden="true">
      <div className="opening-panel opening-panel--top" onAnimationEnd={() => setIsComplete(true)} />
      <div className="opening-panel opening-panel--bottom" />
    </div>
  )
}

export default OpeningTransition
