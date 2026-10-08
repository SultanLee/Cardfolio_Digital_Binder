import React, { useEffect, useRef } from 'react'
import { Card } from '../../types/card'

interface WishedCardItem {
  card: Card
  packName: string
}

/** 팩 이름으로 그룹화 */
function groupByPack(
  wishedCards: WishedCardItem[],
): { packName: string; cards: WishedCardItem[] }[] {
  const groups: { packName: string; cards: WishedCardItem[] }[] = []
  for (const item of wishedCards) {
    const last = groups[groups.length - 1]
    if (last && last.packName === item.packName) {
      last.cards.push(item)
    } else {
      groups.push({ packName: item.packName, cards: [item] })
    }
  }
  return groups
}

/** 위시 카드 총 수에 따라 열 수 자동 결정 */
function calcColumns(total: number): number {
  if (total <= 5) return total
  if (total <= 12) return 4
  if (total <= 20) return 5
  if (total <= 30) return 6
  return 7
}

/** 레어도 뱃지 인라인 스타일 */
function rarityBadgeStyle(rarity?: string): React.CSSProperties {
  const map: Record<string, { bg: string; color: string }> = {
    N: { bg: '#4b5563', color: '#e5e7eb' },
    R: { bg: '#1d6ed8', color: '#fff' },
    SR: { bg: '#7c3aed', color: '#fff' },
    SSR: { bg: '#b45309', color: '#fde68a' },
    MR: { bg: '#be123c', color: '#fecdd3' },
    'MR+': { bg: '#7c3aed', color: '#e9d5ff' },
    MLR: { bg: '#0369a1', color: '#bae6fd' },
    PSR: { bg: '#b45309', color: '#fef3c7' },
    CGR: { bg: '#0f766e', color: '#99f6e4' },
    BCGR: { bg: '#c2410c', color: '#fed7aa' },
    CP: { bg: '#4338ca', color: '#c7d2fe' },
    SEC: { bg: '#a16207', color: '#fef08a' },
  }
  const s = rarity ? (map[rarity] ?? { bg: '#374151', color: '#d1d5db' }) : { bg: '#374151', color: '#d1d5db' }
  return { background: s.bg, color: s.color }
}

// ─────────────────────────────────────────────────────────
// 캡처 전용 컴포넌트 (동적 마운트 방식으로 사용)
// 마운트 직후 onMount(divEl) 를 호출해 ref를 상위에 전달합니다.
// ─────────────────────────────────────────────────────────
interface ExportViewForCaptureProps {
  wishedCards: WishedCardItem[]
  wishes: Record<string, number>
  onMount: (el: HTMLDivElement) => void
}

export const ExportViewForCapture: React.FC<ExportViewForCaptureProps> = ({
  wishedCards,
  wishes,
  onMount,
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) onMount(ref.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const groups = groupByPack(wishedCards)
  const totalCount = wishedCards.length
  const cols = calcColumns(totalCount)

  const TILE_W = 120
  const TILE_H = Math.round(TILE_W / 0.714) // 5:7 비율 ≈ 168px
  const GAP = 10
  const SECTION_PADDING = 16
  const containerWidth = cols * (TILE_W + GAP) - GAP + SECTION_PADDING * 2

  return (
    <div
      ref={ref}
      style={{
        background: '#ffffff',
        padding: SECTION_PADDING,
        width: containerWidth,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {groups.map((group) => (
        <div key={group.packName} style={{ marginBottom: 20 }}>
          {/* 팩 이름 헤더 */}
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#374151',
              padding: '4px 0 6px',
              borderBottom: '1.5px solid #d1d5db',
              marginBottom: 8,
              letterSpacing: '0.02em',
            }}
          >
            {group.packName}
          </div>

          {/* 카드 그리드 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, ${TILE_W}px)`,
              gap: GAP,
            }}
          >
            {group.cards.map(({ card }) => {
              const targetQty = wishes[card.id] ?? 1
              return (
                <div
                  key={card.id}
                  style={{
                    position: 'relative',
                    width: TILE_W,
                    height: TILE_H,
                    borderRadius: 6,
                    overflow: 'hidden',
                  }}
                >
                  {/* 카드 이미지 */}
                  <img
                    src={card.imagePath}
                    alt=""
                    // lazy 금지 — 항상 즉시 로드
                    loading="eager"
                    decoding="sync"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />

                  {/* 레어도 뱃지 (좌상단) */}
                  {card.rarity && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 4,
                        left: 4,
                        fontSize: 8,
                        fontWeight: 800,
                        padding: '1px 4px',
                        borderRadius: 3,
                        lineHeight: 1.5,
                        letterSpacing: '0.04em',
                        ...rarityBadgeStyle(card.rarity),
                      }}
                    >
                      {card.rarity}
                    </div>
                  )}

                  {/* 목표 수량 뱃지 (우상단, 원형) */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: '#111827',
                      border: '1.5px solid #ffffff',
                      color: '#ffffff',
                      fontSize: 10,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: 1,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
                    }}
                  >
                    {targetQty}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
