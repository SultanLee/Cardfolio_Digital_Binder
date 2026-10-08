import React, { useState, useMemo, useCallback } from 'react'
import ReactDOM from 'react-dom/client'
import { toPng } from 'html-to-image'
import { CardsData, Card } from '../types/card'
import { CardModal } from '../components/CardModal'
import { useWishlistStore } from '../stores/useWishlistStore'
import { WishlistGrid } from '../features/wishlist/WishlistGrid'
import { ExportViewForCapture } from '../features/wishlist/WishlistExportView'

interface WishlistPageProps {
  data: CardsData
}

/** 캡처 대상 div 내의 모든 <img>가 로드될 때까지 대기 */
async function waitForImages(el: HTMLElement): Promise<void> {
  const imgs = Array.from(el.querySelectorAll<HTMLImageElement>('img'))
  await Promise.all(
    imgs.map(
      (img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((res) => {
              img.onload = () => res()
              img.onerror = () => res() // 에러 이미지도 건너뛰기
            }),
    ),
  )
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ data }) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const wishes = useWishlistStore((state) => state.wishes)
  const clearWishlist = useWishlistStore((state) => state.clearWishlist)

  // 위시리스트에 있는 카드를 전체 데이터에서 조회 (팩 순서 유지)
  const wishedCards = useMemo(() => {
    const result: { card: Card; packName: string }[] = []
    for (const pack of data.packs) {
      for (const card of pack.cards) {
        if (card.id in wishes) {
          result.push({ card, packName: pack.name })
        }
      }
    }
    return result
  }, [data.packs, wishes])

  const wishCount = wishedCards.length

  /**
   * PNG 내보내기 — 동적 마운트 패턴
   * 1. 임시 div를 body에 추가 (opacity:0, 화면 내 위치)
   * 2. ExportViewForCapture를 createRoot로 렌더링
   * 3. 마운트 완료 후 모든 이미지 로드 대기
   * 4. html-to-image로 캡처 → 다운로드
   * 5. 임시 div 제거
   */
  const handleExport = useCallback(async () => {
    if (wishCount === 0) return
    setIsExporting(true)

    // 임시 컨테이너: 화면에는 보이지 않지만 렌더링은 정상 수행
    const tempContainer = document.createElement('div')
    tempContainer.style.cssText =
      'position:fixed;top:0;left:0;opacity:0;pointer-events:none;z-index:-1;'
    document.body.appendChild(tempContainer)

    const root = ReactDOM.createRoot(tempContainer)

    try {
      // 캡처 대상 div를 콜백으로 받아옴
      const captureEl = await new Promise<HTMLDivElement>((resolve) => {
        root.render(
          <ExportViewForCapture
            wishedCards={wishedCards}
            wishes={wishes}
            onMount={resolve}
          />,
        )
      })

      // 모든 이미지 로드 완료까지 대기
      await waitForImages(captureEl)

      // 추가 렌더 안정화 대기 (글꼴·레이아웃 확정)
      await new Promise((res) => setTimeout(res, 120))

      const dataUrl = await toPng(captureEl, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      })

      const link = document.createElement('a')
      link.download = `wishlist_${new Date().toISOString().slice(0, 10)}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('PNG 내보내기 실패:', err)
      alert('이미지 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      root.unmount()
      tempContainer.remove()
      setIsExporting(false)
    }
  }, [wishCount, wishedCards, wishes])

  return (
    <div className="wishlist-page">
      <section className="wishlist-dashboard">
        <div className="wishlist-header-bar">
          <div className="wishlist-title-area">
            <h2 className="wishlist-title">위시 리스트</h2>
            <span className="wishlist-count-badge">{wishCount}장</span>
          </div>
          <div className="wishlist-header-actions">
            {wishCount > 0 && (
              <>
                <button
                  className="wishlist-export-btn"
                  onClick={handleExport}
                  disabled={isExporting}
                  title="위시 리스트를 PNG 이미지로 저장"
                >
                  {isExporting ? '저장 중…' : '🖼 이미지로 저장'}
                </button>
                <button
                  className="wishlist-clear-btn"
                  onClick={() => {
                    if (window.confirm('위시 리스트를 전부 비우시겠어요?')) {
                      clearWishlist()
                    }
                  }}
                >
                  전체 삭제
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {wishCount === 0 ? (
        <div className="wishlist-empty-state">
          <div className="wishlist-empty-icon">♡</div>
          <p className="wishlist-empty-text">위시 리스트가 비어 있어요.</p>
          <p className="wishlist-empty-hint">
            카드 목록 화면에서 카드를 클릭한 뒤 ♡ 버튼을 눌러 추가해 보세요.
          </p>
        </div>
      ) : (
        <WishlistGrid
          wishedCards={wishedCards}
          onSelectCard={(card) => setSelectedCard(card)}
        />
      )}

      <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />
    </div>
  )
}
