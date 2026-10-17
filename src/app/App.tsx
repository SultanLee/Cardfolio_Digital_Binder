import React from 'react'
import { BrowserRouter, Routes, Route, NavLink, Link } from 'react-router-dom'
import cardsData from '../data/cards.json'
import { CardsData } from '../types/card'
import { CardListPage } from '../pages/CardListPage'
import { WishlistPage } from '../pages/WishlistPage'
import { useWishlistStore } from '../stores/useWishlistStore'
import { useThemeStore } from '../stores/useThemeStore'
import { useCollectionStore } from '../stores/useCollectionStore'
import { useCardBrowseStore } from '../stores/useCardBrowseStore'

const data = cardsData as unknown as CardsData

const AppLayout: React.FC = () => {
  const [homeResetKey, setHomeResetKey] = React.useState(0)
  const wishCount = useWishlistStore((state) => Object.keys(state.wishes).length)
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const setSelectedCardScope = useCollectionStore((state) => state.setSelectedCardScope)
  const setSortMode = useCollectionStore((state) => state.setSortMode)
  const resetBrowse = useCardBrowseStore((state) => state.resetBrowse)

  const returnHome = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    setSelectedCardScope('all')
    setSortMode('default')
    resetBrowse()
    // 같은 카드 목록 화면에서도 검색·필터·페이지 등 임시 상태를 초기화한다.
    setHomeResetKey((key) => key + 1)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div className="app-shell">
      {/* 전역 상단 네비게이션 바 */}
      <nav className="global-nav">
        <div className="global-nav-inner">
          <Link to="/" className="nav-brand" onClick={returnHome} aria-label="Cardfolio 홈 · 전체 카드로 이동">
            <span className="nav-logo-text">Cardfolio</span>
            <span className="nav-logo-sub">아이돌마스터 카드폴리오</span>
          </Link>
          <div className="nav-actions">
            <div className="nav-links">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                카드 목록
              </NavLink>
              <NavLink
                to="/wishlist"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                위시 리스트
                {wishCount > 0 && (
                  <span className="nav-wish-count">{wishCount}</span>
                )}
              </NavLink>
            </div>

            {/* 다크 / 라이트 모드 토글 버튼 */}
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
              title={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </nav>

      {/* 페이지 콘텐츠 */}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<CardListPage key={homeResetKey} data={data} />} />
          <Route path="/wishlist" element={<WishlistPage data={data} />} />
        </Routes>
      </main>
    </div>
  )
}

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

export default App
