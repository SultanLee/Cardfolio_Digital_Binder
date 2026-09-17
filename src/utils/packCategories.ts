import { Pack } from '../types/card'

export interface CategoryGroup {
  id: string
  categoryName: string
  order: number
  packs: Pack[]
}

const CATEGORY_DEFINITIONS = [
  {
    id: 'imas',
    name: '아이돌마스터',
    order: 1,
    matcher: (name: string) =>
      name.includes('アイドルマスター') && !name.includes('学園'),
  },
  {
    id: 'cg',
    name: '아이돌마스터 신데렐라 걸즈',
    order: 2,
    matcher: (name: string) => name.includes('シンデレラガールズ'),
  },
  {
    id: 'ml',
    name: '아이돌마스터 밀리언라이브',
    order: 3,
    matcher: (name: string) => name.includes('ミリオンライブ'),
  },
  {
    id: 'sidem',
    name: '아이돌마스터 SIDE M',
    order: 4,
    matcher: (name: string) => name.toLowerCase().includes('sidem'),
  },
  {
    id: 'sc',
    name: '아이돌마스터 샤이니 컬러즈',
    order: 5,
    matcher: (name: string) => name.includes('シャイニーカラーズ'),
  },
  {
    id: 'gkmas',
    name: '학원 아이돌마스터',
    order: 6,
    matcher: (name: string) => name.includes('学園'),
  },
  {
    id: 'premium',
    name: '프리미엄 팩 시리즈',
    order: 7,
    matcher: (name: string) =>
      name.includes('プレミアムパック') ||
      name.includes('DAY') ||
      name.includes('IWSF'),
  },
]

function getSubOrder(name: string): number {
  if (name.includes('vol.1')) return 1
  if (name.includes('vol.2')) return 2
  if (name.includes('vol.3')) return 3
  if (name.includes('vol.4')) return 4
  if (name.includes('vol.5')) return 5
  if (name.includes('vol.6')) return 6
  if (name.includes('DAY1')) return 1
  if (name.includes('DAY2')) return 2
  if (name.includes('IWSF')) return 3
  // vol 번호가 없는 기본 팩 (예: アイドルマスターver, ミリオンライブ！ver)은 맨 앞
  return 0
}

/**
 * 20개 팩을 사용자가 지정한 7개 카테고리 순서대로 그룹화하고,
 * 각 그룹 내에서도 볼륨 순서대로 정렬하여 반환합니다.
 */
export function groupPacksByCategory(packs: Pack[]): CategoryGroup[] {
  const groups: CategoryGroup[] = CATEGORY_DEFINITIONS.map((def) => ({
    id: def.id,
    categoryName: def.name,
    order: def.order,
    packs: [],
  }))

  const otherGroup: CategoryGroup = {
    id: 'other',
    categoryName: '기타 부스터팩',
    order: 99,
    packs: [],
  }

  for (const pack of packs) {
    const matchedCategory = CATEGORY_DEFINITIONS.find((def) =>
      def.matcher(pack.name)
    )
    if (matchedCategory) {
      const group = groups.find((g) => g.id === matchedCategory.id)
      group?.packs.push(pack)
    } else {
      otherGroup.packs.push(pack)
    }
  }

  // 각 그룹 내부 볼륨 순 정렬
  for (const group of groups) {
    group.packs.sort((a, b) => getSubOrder(a.name) - getSubOrder(b.name))
  }
  otherGroup.packs.sort((a, b) => a.name.localeCompare(b.name))

  const result = groups.filter((g) => g.packs.length > 0)
  if (otherGroup.packs.length > 0) {
    result.push(otherGroup)
  }

  return result
}

/**
 * 카테고리 순서대로 정렬된 팩들의 1차원 목록을 반환합니다.
 */
export function getSortedPacks(packs: Pack[]): Pack[] {
  const groups = groupPacksByCategory(packs)
  return groups.flatMap((g) => g.packs)
}
