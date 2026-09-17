import React from 'react'
import cardsData from '../data/cards.json'
import { CardsData } from '../types/card'
import { CardListPage } from '../pages/CardListPage'

const data = cardsData as unknown as CardsData

export const App: React.FC = () => {
  return <CardListPage data={data} />
}

export default App
