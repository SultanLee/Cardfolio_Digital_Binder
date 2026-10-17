import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Idol } from '../types/idol'
import { getIdolSearchSuggestions, replaceLastSearchTerm } from '../utils/idolSearch'

interface IdolSearchProps {
  idols: readonly Idol[]
  value: string
  onChange: (value: string) => void
  hasIdolData: boolean
  scopeName: string
}

export const IdolSearch: React.FC<IdolSearchProps> = ({ idols, value, onChange, hasIdolData, scopeName }) => {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const suggestions = useMemo(() => getIdolSearchSuggestions(idols, value), [idols, value])
  const activeSuggestion = isOpen ? suggestions[activeIndex] : undefined

  useEffect(() => {
    if (!isOpen) return
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !dropdownRef.current?.contains(event.target)) setIsOpen(false)
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [isOpen])

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0
  }, [value])

  useEffect(() => {
    if (activeSuggestion) {
      document.getElementById(`${id}-option-${activeSuggestion.id}`)?.scrollIntoView({ block: 'nearest' })
    }
  }, [id, activeSuggestion])

  const selectSuggestion = (nextValue: string) => {
    onChange(replaceLastSearchTerm(value, nextValue))
    inputRef.current?.focus()
    setIsOpen(false)
    setActiveIndex(-1)
  }

  return (
    <div className="idol-search">
      <div className="idol-search-control">
        <label htmlFor={id} className="pack-select-label">아이돌 검색</label>
        <div className="idol-search-dropdown" ref={dropdownRef} onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false)
        }}>
          <div className="idol-search-field">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m16 16 4.5 4.5" />
            </svg>
            <input
              ref={inputRef}
              id={id}
              type="search"
              value={value}
              onFocus={() => setIsOpen(true)}
              onClick={() => setIsOpen(true)}
              onChange={(event) => {
                onChange(event.target.value)
                setActiveIndex(-1)
                setIsOpen(true)
              }}
              placeholder="이름·유닛 검색"
              autoComplete="off"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={isOpen}
              aria-controls={`${id}-suggestions`}
              aria-activedescendant={activeSuggestion ? `${id}-option-${activeSuggestion.id}` : undefined}
              aria-describedby={`${id}-hint`}
              onKeyDown={(event) => {
                if (event.nativeEvent.isComposing) return
                if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                  event.preventDefault()
                  setIsOpen(true)
                  if (suggestions.length) {
                    const direction = event.key === 'ArrowDown' ? 1 : -1
                    setActiveIndex(!isOpen || activeIndex < 0
                      ? direction === 1 ? 0 : suggestions.length - 1
                      : (activeIndex + direction + suggestions.length) % suggestions.length)
                  }
                } else if (event.key === 'Enter' && isOpen) {
                  event.preventDefault()
                  if (activeSuggestion) selectSuggestion(activeSuggestion.value)
                  else setIsOpen(false)
                } else if (event.key === 'Escape') {
                  event.preventDefault()
                  onChange('')
                  setIsOpen(false)
                  setActiveIndex(-1)
                }
              }}
            />
            {value && (
              <button type="button" className="idol-search-clear" onClick={() => {
                onChange('')
                inputRef.current?.focus()
                setActiveIndex(-1)
                setIsOpen(true)
              }} aria-label="아이돌 검색 지우기">
                ×
              </button>
            )}
          </div>
          {isOpen && (
            <ul ref={listRef} id={`${id}-suggestions`} className="idol-search-suggestions" role="listbox" aria-label="아이돌 검색 추천">
              {suggestions.map((suggestion, index) => (
                <li key={suggestion.id} role="presentation">
                  <button
                    type="button"
                    id={`${id}-option-${suggestion.id}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    tabIndex={-1}
                    className={`idol-search-option ${index === activeIndex ? 'active' : ''}`}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectSuggestion(suggestion.value)}
                  >
                    <span>{suggestion.value}</span>
                    <small>{suggestion.description}</small>
                  </button>
                </li>
              ))}
              {suggestions.length === 0 && <li className="idol-search-no-suggestions" role="presentation">일치하는 검색어가 없습니다.</li>}
            </ul>
          )}
        </div>
      </div>
      <p id={`${id}-hint`} className="idol-search-hint">
        {hasIdolData
          ? `${scopeName}에서 검색 · 한국어 / 日本語 / English`
          : '선택한 범위의 아이돌 정보는 준비 중입니다.'}
        <span className="idol-search-multi-hint">여러 명은 쉼표로 구분 · 예: 하루카, 치하야</span>
      </p>
    </div>
  )
}
