import React from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import cardsData from '../data/cards.json'
import { CardsData } from '../types/card'
import { CardListPage } from '../pages/CardListPage'
import { WishlistPage } from '../pages/WishlistPage'
import { useWishlistStore } from '../stores/useWishlistStore'

const data = cardsData as unknown as CardsData

const AppLayout: React.FC = () => {
  const wishCount = useWishlistStore((state) => Object.keys(state.wishes).length)

  return (
    <div className="app-shell">
      {/* 전역 상단 네비게이션 바 */}
      <nav className="global-nav">
        <div className="global-nav-inner">
          <div className="nav-brand">
            <span className="nav-logo-text">Cardfolio</span>
            <span className="nav-logo-sub">아이돌마스터 카드폴리오</span>
          </div>
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
        </div>
      </nav>

      {/* 페이지 콘텐츠 */}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<CardListPage data={data} />} />
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
