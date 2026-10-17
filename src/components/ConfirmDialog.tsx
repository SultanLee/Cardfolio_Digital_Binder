import React, { useEffect, useId, useRef } from 'react'

interface ConfirmDialogProps {
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ title, description, confirmLabel, onConfirm, onCancel }) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog?.showModal()
    return () => {
      dialog?.close()
      document.body.style.overflow = previousOverflow
    }
  }, [])

  return (
    <dialog ref={dialogRef} className="confirm-dialog" aria-labelledby={titleId} aria-describedby={descriptionId}
      onCancel={(event) => { event.preventDefault(); onCancel() }}
      onClick={(event) => { if (event.target === event.currentTarget) onCancel() }}>
      <div className="confirm-dialog-panel">
        <div className="confirm-dialog-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M9 6V4h6v2M5 6l1 14h12l1-14M10 10v6M14 10v6" />
          </svg>
        </div>
        <h2 id={titleId}>{title}</h2>
        <p id={descriptionId}>{description}</p>
        <div className="confirm-dialog-actions">
          <button type="button" autoFocus onClick={onCancel}>취소</button>
          <button type="button" className="confirm-dialog-danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </dialog>
  )
}
