import { Idol } from '../types/idol'
import searchGroupData from '../data/idol-search-groups.json'
import unitData from '../data/idol-units.json'
import refractionsData from '../data/shiny-refractions.json'

export const idolSearchGroups = searchGroupData.groups

function normalizeSearch(value: string): string {
  return value.normalize('NFKC').toLowerCase().replace(/\s+/g, '')
}

export interface IdolSearchSuggestion {
  id: string
  value: string
  description: string
}

const searchSeparators = /[,，、]/

export function splitIdolSearchQuery(query: string): string[] {
  return query.split(searchSeparators).map((term) => term.trim()).filter(Boolean)
}

export function replaceLastSearchTerm(query: string, nextValue: string): string {
  const separatorIndex = Math.max(query.lastIndexOf(','), query.lastIndexOf('，'), query.lastIndexOf('、'))
  return separatorIndex < 0 ? nextValue : `${query.slice(0, separatorIndex + 1)} ${nextValue}`
}

function getSearchGroups(idols: readonly Idol[]) {
  return [
    ...unitData.units.map((unit) => ({
      id: `unit-${unit.id}`,
      name: unit.nameKo,
      aliases: [unit.nameJa, ...unit.aliases],
      description: `${unit.nameJa} · ${unit.series}`,
      idolIds: idols.filter((idol) => idol.series === unit.series && idol.unit === unit.unit).map((idol) => idol.id),
    })).filter((unit) => unit.idolIds.length > 0),
    ...refractionsData.groups.map((group) => ({
      id: `refractions-${group.id}`,
      name: group.nameKo,
      aliases: [group.name, group.nameJa, ...group.aliases],
      description: `${group.nameJa} · PJ: REFRAC7IONS`,
      idolIds: group.idolIds,
    })),
    {
      id: 'project-refractions',
      name: refractionsData.project.nameKo,
      aliases: [refractionsData.project.nameJa, ...refractionsData.project.aliases],
      description: 'PJ: REFRAC7IONS · 7개 그룹 28명',
      idolIds: refractionsData.groups.flatMap((group) => group.idolIds),
    },
    ...idolSearchGroups,
  ]
}

export function getIdolSearchSuggestions(idols: readonly Idol[], query: string): IdolSearchSuggestion[] {
  const terms = query.split(searchSeparators)
  const normalizedQuery = normalizeSearch(terms[terms.length - 1] ?? '')
  return [
    ...idols
      .filter((idol) => [idol.nameKo, idol.nameJa, ...idol.aliases]
        .some((name) => normalizeSearch(name).includes(normalizedQuery)))
      .map((idol) => ({ id: `idol-${idol.id}`, value: idol.nameKo, description: `${idol.nameJa} · ${idol.series}` })),
    ...getSearchGroups(idols)
      .filter((group) => [group.name, ...group.aliases]
        .some((name) => normalizeSearch(name).includes(normalizedQuery)))
      .map((group) => ({ id: `group-${group.id}`, value: group.name, description: group.description })),
  ]
}

export function findMatchingIdolIds(idols: readonly Idol[], query: string): Set<string> {
  const groups = getSearchGroups(idols)
  const matches = new Set<string>()
  for (const term of splitIdolSearchQuery(query)) {
    const normalizedTerm = normalizeSearch(term)
    const matchingGroups = groups.filter((group) =>
      [group.name, ...group.aliases].some((name) => normalizeSearch(name) === normalizedTerm),
    )
    // W 등 짧은 유닛명이 이름 별칭의 일부와 겹쳐도 해당 유닛만 검색한다.
    if (matchingGroups.length) {
      matchingGroups.forEach((group) => group.idolIds.forEach((id) => matches.add(id)))
    } else {
      idols.forEach((idol) => {
        if ([idol.nameKo, idol.nameJa, ...idol.aliases].some((name) => normalizeSearch(name).includes(normalizedTerm))) {
          matches.add(idol.id)
        }
      })
    }
  }
  return new Set(idols.filter((idol) => matches.has(idol.id)).map((idol) => idol.id))
}
