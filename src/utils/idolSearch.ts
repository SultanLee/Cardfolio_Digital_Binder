import { Idol } from '../types/idol'
import searchGroupData from '../data/idol-search-groups.json'

export const idolSearchGroups = searchGroupData.groups

function normalizeSearch(value: string): string {
  return value.normalize('NFKC').toLowerCase().replace(/\s+/g, '')
}

export interface IdolSearchSuggestion {
  id: string
  value: string
  description: string
}

export function getIdolSearchSuggestions(idols: readonly Idol[], query: string): IdolSearchSuggestion[] {
  const normalizedQuery = normalizeSearch(query)
  return [
    ...idols
      .filter((idol) => [idol.nameKo, idol.nameJa, ...idol.aliases]
        .some((name) => normalizeSearch(name).includes(normalizedQuery)))
      .map((idol) => ({ id: `idol-${idol.id}`, value: idol.nameKo, description: `${idol.nameJa} · ${idol.series}` })),
    ...idolSearchGroups
      .filter((group) => [group.name, ...group.aliases]
        .some((name) => normalizeSearch(name).includes(normalizedQuery)))
      .map((group) => ({ id: `group-${group.id}`, value: group.name, description: group.description })),
  ]
}

export function findMatchingIdolIds(idols: readonly Idol[], query: string): Set<string> {
  const normalizedQuery = normalizeSearch(query)
  if (!normalizedQuery) return new Set()

  const groupMemberIds = new Set(
    idolSearchGroups
      .filter((group) =>
        [group.name, ...group.aliases].some((name) => normalizeSearch(name) === normalizedQuery),
      )
      .flatMap((group) => group.idolIds),
  )

  return new Set(
    idols
      .filter((idol) =>
        groupMemberIds.has(idol.id) ||
        [idol.nameKo, idol.nameJa, ...idol.aliases].some((name) =>
          normalizeSearch(name).includes(normalizedQuery),
        ),
      )
      .map((idol) => idol.id),
  )
}
