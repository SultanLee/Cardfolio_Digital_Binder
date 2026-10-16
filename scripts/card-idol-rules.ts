import searchGroupData from '../src/data/idol-search-groups.json'
import iwsfOrder from '../src/data/iwsf-pack-order.json'

// アイドルマスターver의 실제 카드 순서. 등록 당시 idol.json의 올스타즈 13인
// 순서를 고정하여 이후 명부 재정렬이나 다른 시리즈 추가의 영향을 받지 않게 한다.
const allStarsOrder = [
  'amami-haruka',
  'kisaragi-chihaya',
  'hoshii-miki',
  'hagiwara-yukiho',
  'takatsuki-yayoi',
  'kikuchi-makoto',
  'minase-iori',
  'shijou-takane',
  'akizuki-ritsuko',
  'miura-azusa',
  'futami-ami',
  'futami-mami',
  'ganaha-hibiki',
]

const rareOrder = [...allStarsOrder, 'otonashi-kotori']

// 스탈릿 시즌 기본 등장 인물: 루미너스 29명 + 디아만트 3명.
// 공식 명부의 DLC 추가 인물(카에데·코토하·마미미)은 제외한다.
// https://starlit-season.idolmaster.jp/idol/
const starlitSeasonBaseIdols = [
  ...allStarsOrder,
  'abe-nana', 'kanzaki-ranko', 'jougasaki-mika', 'futaba-anzu', 'moroboshi-kirari',
  'kasuga-mirai', 'mogami-shizuka', 'ibuki-tsubasa', 'shiraishi-tsumugi', 'sakuramori-kaori',
  'shirase-sakuya', 'komiya-kaho', 'morino-rinze', 'osaki-amana', 'osaki-tenka',
  'okuzora-kohaku',
  'leon', 'shika', 'aya',
]
if (starlitSeasonBaseIdols.length !== 32 || new Set(starlitSeasonBaseIdols).size !== 32) {
  throw new Error('스탈릿 시즌 기본 등장 인물 연결에는 중복 없는 아이돌 ID 32개가 필요합니다.')
}

// MOIW의 공통 SR. 레드는 카드 연결용 멤버 목록이며 검색 별칭으로 등록하지 않는다.
const moiwRedOrder = [
  'amami-haruka', 'shimamura-uzuki', 'kasuga-mirai',
  'tendo-teru', 'sakuragi-mano', 'hanami-saki',
]
const moiwTrafficLights = searchGroupData.groups.find((group) => group.id === 'traffic-lights')?.idolIds
if (!moiwTrafficLights || moiwTrafficLights.length !== 18 || new Set(moiwTrafficLights).size !== 18) {
  throw new Error('MOIW 신호등 카드 연결에는 검색 그룹의 아이돌 ID 18개가 필요합니다.')
}
const moiwSrOverrides: Record<string, readonly string[]> = {
  'img_wld_sr_0119.webp': moiwRedOrder,
  'img_wld_sr_0120.webp': moiwRedOrder,
  'img_wld_sr_0121.webp': moiwRedOrder,
  'img_wld_sr_0122.webp': ['amami-haruka'],
  'img_wld_sr_0123.webp': ['amami-haruka'],
  'img_wld_sr_0124.webp': ['shimamura-uzuki'],
  'img_wld_sr_0125.webp': ['kasuga-mirai'],
  'img_wld_sr_0126.webp': ['tendo-teru'],
  'img_wld_sr_0127.webp': ['sakuragi-mano'],
  'img_wld_sr_0128.webp': ['hanami-saki'],
  'img_wld_sr_0129.webp': moiwRedOrder,
  'img_wld_sr_0130.webp': moiwTrafficLights,
  'img_wld_sr_0131.webp': moiwTrafficLights,
  'img_wld_sr_0132.webp': starlitSeasonBaseIdols,
  'img_wld_sr_0133.webp': moiwRedOrder.filter((id) => id !== 'hanami-saki'),
  'img_wld_sr_0134.webp': ['shijou-takane'],
  'img_wld_sr_0135.webp': ['fujiwara-hajime'],
  'img_wld_sr_0136.webp': ['tanaka-kotoha'],
  'img_wld_sr_0137.webp': ['sakuraba-kaoru'],
  'img_wld_sr_0138.webp': ['asakura-toru'],
  'img_wld_sr_0139.webp': ['kuramoto-china'],
  'img_wld_sr_0140.webp': ['otonashi-kotori'],
  'img_wld_sr_0141.webp': ['senkawa-chihiro'],
  'img_wld_sr_0142.webp': ['aoba-misaki'],
  'img_wld_sr_0143.webp': ['yamamura-ken'],
  'img_wld_sr_0144.webp': ['nanakusa-hazuki'],
  'img_wld_sr_0145.webp': ['neo-asari'],
}

const shinyColorsRules: Record<string, { filenamePattern: RegExp; ssrStart: number }> = {
  'シャイニーカラーズver. vol.1': { filenamePattern: /^img_sc_01_(\d+)\.webp$/, ssrStart: 85 },
  'シャイニーカラーズver. vol.2': { filenamePattern: /^img_sc_02_(\d+)\.webp$/, ssrStart: 65 },
  'シャイニーカラーズver. vol.3': { filenamePattern: /^img_sc_03_(\d+)\.webp$/, ssrStart: 64 },
}

const millionLivePatterns: Record<string, RegExp> = {
  'ミリオンライブ！ver': /^img_ml_(\d+)\.webp$/,
  'ミリオンライブ！ver. vol.2': /^img_ml_02_(\d+)\.webp$/,
  'ミリオンライブ！ver. vol.3': /^img_ml_03_(\d+)\.webp$/,
  'ミリオンライブ！ver. vol.4': /^img_ml_04_(\d+)\.webp$/,
}

// 라이브 참가 아이돌 순서. 각 팩의 R과 MLR에 같은 순서를 적용한다.
const millionLiveLiveOrders: Record<string, readonly string[]> = {
  'ミリオンライブ！ver. vol.2': [
    'kitakami-reika',
    'mogami-shizuka',
    'roco',
    'takayama-sayoko',
    'tenkubashi-tomoka',
    'yokoyama-nao',
    'nikaido-chizuru',
    'toyokawa-fuka',
    'miyao-miya',
    'fukuda-noriko',
    'makabe-mizuki',
    'shinomiya-karen',
    'momose-rio',
    'sakuramori-kaori',
    'kasuga-mirai',
    'ibuki-tsubasa',
    'shimabara-elena',
    'satake-minako',
    'nonohara-akane',
    'nakatani-iku',
    'emily-stewart',
    'ogami-tamaki',
    'nagayoshi-subaru',
    'suou-momoko',
    'julia',
    'shiraishi-tsumugi',
  ],
  'ミリオンライブ！ver. vol.3': [
    'roco',
    'mogami-shizuka',
    'nonohara-akane',
    'takayama-sayoko',
    'kinoshita-hinata',
    'yabuki-kana',
    'yokoyama-nao',
    'nikaido-chizuru',
    'baba-konomi',
    'miyao-miya',
    'fukuda-noriko',
    'nagayoshi-subaru',
    'kitakami-reika',
    'julia',
    'shiraishi-tsumugi',
    'nanao-yuriko',
    'ibuki-tsubasa',
    'shimabara-elena',
    'satake-minako',
    'hakozaki-serika',
    'mochizuki-anna',
    'nakatani-iku',
    'tenkubashi-tomoka',
    'emily-stewart',
    'ogami-tamaki',
    'toyokawa-fuka',
    'makabe-mizuki',
    'shinomiya-karen',
    'momose-rio',
    'suou-momoko',
    'sakuramori-kaori',
  ],
  'ミリオンライブ！ver. vol.4': [
    'takayama-sayoko',
    'kasuga-mirai',
    'ibuki-tsubasa',
    'shimabara-elena',
    'tokugawa-matsuri',
    'nonohara-akane',
    'nakatani-iku',
    'yabuki-kana',
    'yokoyama-nao',
    'ogami-tamaki',
    'miyao-miya',
    'fukuda-noriko',
    'shinomiya-karen',
    'kitakami-reika',
    'nikaido-chizuru',
    'satake-minako',
    'roco',
    'tenkubashi-tomoka',
    'baba-konomi',
    'toyokawa-fuka',
    'makabe-mizuki',
    'momose-rio',
    'nagayoshi-subaru',
    'suou-momoko',
    'julia',
    'shiraishi-tsumugi',
    'sakuramori-kaori',
  ],
}

// MR처럼 반복 순서에 포함되지 않는 카드는 팩·파일별로 직접 지정한다.
const cardIdolOverrides: Record<string, Record<string, readonly string[]>> = {
  'シンデレラガールズver. vol.1': {
    'img_cg_01_0127.webp': ['shimamura-uzuki'],
    'img_cg_01_0128.webp': ['koshimizu-sachiko'],
    'img_cg_01_0129.webp': ['takagaki-kaede'],
    'img_cg_01_0130.webp': ['kanzaki-ranko'],
    'img_cg_01_0131.webp': ['moroboshi-kirari'],
    'img_cg_01_0132.webp': ['sato-shin'],
  },
  'シンデレラガールズver. vol.2': {
    'img_cg_02_0127.webp': ['tsujino-akari'],
    'img_cg_02_0128.webp': ['hojo-karen'],
    'img_cg_02_0129.webp': ['kurosaki-chitose'],
    'img_cg_02_0130.webp': ['hino-akane'],
    'img_cg_02_0131.webp': ['takamori-aiko'],
    'img_cg_02_0132.webp': ['sagisawa-fumika'],
  },
  'シンデレラガールズver. vol.3': {
    'img_cg_03_0129.webp': ['morikubo-nono'],
    'img_cg_03_0130.webp': ['sakuma-mayu'],
    'img_cg_03_0131.webp': ['tada-riina'],
    'img_cg_03_0132.webp': ['kobayakawa-sae'],
    'img_cg_03_0133.webp': ['yorita-yoshino'],
    'img_cg_03_0134.webp': ['hisakawa-nagi'],
  },
  'シンデレラガールズver. vol.4': {
    'img_cg_04_0127.webp': ['abe-nana'],
    'img_cg_04_0128.webp': ['ichinose-shiki'],
    'img_cg_04_0129.webp': ['shirasaka-koume'],
    'img_cg_04_0130.webp': ['yuuki-haru'],
    'img_cg_04_0131.webp': ['koseki-reina'],
    'img_cg_04_0132.webp': ['mukai-takumi'],
  },
  'シンデレラガールズver. vol.5': {
    'img_cg_05_0127.webp': ['kanzaki-ranko'],
    'img_cg_05_0128.webp': ['futaba-anzu'],
    'img_cg_05_0129.webp': ['aikawa-chinatsu'],
    'img_cg_05_0130.webp': ['muramatsu-sakura'],
    'img_cg_05_0131.webp': ['kimura-natsuki'],
    'img_cg_05_0132.webp': ['akagi-miria'],
  },
  'シンデレラガールズver. vol.6': {
    'img_cg_06_0129.webp': ['eve-santaclaus'],
    'img_cg_06_0130.webp': ['ohara-michiru'],
    'img_cg_06_0131.webp': ['otokura-yuuki'],
    'img_cg_06_0132.webp': ['hayami-kanade'],
    'img_cg_06_0133.webp': ['anastasia'],
    'img_cg_06_0134.webp': ['totoki-airi'],
  },
  '学園アイドルマスター ver. vol.1': {
    'img_gkmas_01_0079.webp': ['hanami-saki'],
    'img_gkmas_01_0080.webp': ['tsukimura-temari'],
    'img_gkmas_01_0081.webp': ['fujita-kotone'],
    'img_gkmas_01_0082.webp': ['arimura-mao'],
    'img_gkmas_01_0083.webp': ['shinosawa-hiro'],
    'img_gkmas_01_0084.webp': ['himesaki-rinami'],
    'img_gkmas_01_0085.webp': ['amaya-tsubame'],
  },
  'ミリオンライブ！ver': {
    'img_ml_0157.webp': ['kitakami-reika'],
    'img_ml_0158.webp': ['sakuramori-kaori'],
  },
  'ミリオンライブ！ver. vol.2': {
    'img_ml_02_0105.webp': ['kitakami-reika'],
    'img_ml_02_0106.webp': ['sakuramori-kaori'],
    'img_ml_02_0107.webp': ['kitakami-reika', 'miyao-miya'],
    'img_ml_02_0108.webp': ['sakuramori-kaori', 'suou-momoko'],
  },
  'ミリオンライブ！ver. vol.3': {
    'img_ml_03_0115.webp': ['roco'],
    'img_ml_03_0116.webp': ['nanao-yuriko'],
    'img_ml_03_0117.webp': ['takayama-sayoko'],
    'img_ml_03_0118.webp': ['nikaido-chizuru'],
    'img_ml_03_0119.webp': ['julia'],
    'img_ml_03_0120.webp': ['tanaka-kotoha'],
    'img_ml_03_0121.webp': ['roco', 'nagayoshi-subaru'],
    'img_ml_03_0122.webp': ['nanao-yuriko', 'mochizuki-anna'],
  },
  'ミリオンライブ！ver. vol.4': {
    'img_ml_04_0107.webp': ['takayama-sayoko'],
    'img_ml_04_0108.webp': ['nikaido-chizuru'],
    'img_ml_04_0109.webp': ['emily-stewart'],
    'img_ml_04_0110.webp': ['tokugawa-matsuri'],
    'img_ml_04_0111.webp': ['baba-konomi'],
    'img_ml_04_0112.webp': ['momose-rio'],
    'img_ml_04_0113.webp': ['suou-momoko'],
    'img_ml_04_0114.webp': ['shiraishi-tsumugi'],
  },
  'シャイニーカラーズver. vol.1': {
    'img_sc_01_0113.webp': ['aketa-mikoto', 'tsukioka-kogane'],
    'img_sc_01_0114.webp': ['mayuzumi-fuyuko', 'arisugawa-natsuha'],
    'img_sc_01_0115.webp': ['ikuta-haruki', 'kuwayama-chiyuki'],
    'img_sc_01_0116.webp': ['fukumaru-koito', 'kazano-hiori'],
  },
  'シャイニーカラーズver. vol.2': {
    'img_sc_02_0093.webp': ['sakuragi-mano'],
    'img_sc_02_0094.webp': ['yukoku-kiriko'],
    'img_sc_02_0095.webp': ['sonoda-chiyoko'],
    'img_sc_02_0096.webp': ['osaki-amana'],
    'img_sc_02_0097.webp': ['izumi-mei'],
    'img_sc_02_0098.webp': ['ichikawa-hinana'],
    'img_sc_02_0099.webp': ['nanakusa-nichika'],
    'img_sc_02_0100.webp': ['ikaruga-luca'],
  },
  'シャイニーカラーズver. vol.3': {
    'img_sc_03_0092.webp': ['suzuki-hana'],
    'img_sc_03_0093.webp': ['asakura-toru'],
    'img_sc_03_0094.webp': ['hachimiya-meguru'],
    'img_sc_03_0095.webp': ['saijo-juri'],
    'img_sc_03_0096.webp': ['ikuta-haruki'],
    'img_sc_03_0097.webp': ['shirase-sakuya'],
    'img_sc_03_0098.webp': ['mitsumine-yuika'],
  },
}

export interface CardIdolOrders {
  moiwOrders: Readonly<Record<string, readonly string[]>>
  cinderellaOrders: Readonly<Record<string, readonly string[]>>
  sideMVol1Order: readonly string[]
  sideMVol1Units: readonly (readonly string[])[]
  sideMVol2Order: readonly string[]
  sideMVol2Units: readonly (readonly string[])[]
  gakuenOrder: readonly string[]
  millionLiveOrder: readonly string[]
  shinyColorsOrder: readonly string[]
  shinyColorsUnits: readonly (readonly string[])[]
  shinyColorsRefractions: readonly (readonly string[])[]
}

/** 연결 규칙이 아직 없는 팩은 undefined를 반환한다. */
export function getCardIdolIds(
  packName: string,
  filename: string,
  {
    moiwOrders,
    cinderellaOrders,
    sideMVol1Order, sideMVol1Units,
    sideMVol2Order, sideMVol2Units,
    gakuenOrder, millionLiveOrder, shinyColorsOrder, shinyColorsUnits, shinyColorsRefractions,
  }: CardIdolOrders,
): string[] | undefined {
  const override = cardIdolOverrides[packName]?.[filename]
  if (override) return [...override]

  if (packName === 'プレミアムパック IWSF') {
    const match = filename.match(/^img_iwsf_01_(\d+)\.webp$/)
    const number = match ? Number(match[1]) : 0
    if (number < 1 || number > 86) return undefined
    if (iwsfOrder.length !== 43 || new Set(iwsfOrder).size !== 43) {
      throw new Error('IWSF R·SSR 연결에는 중복 없는 아이돌 ID 43개가 필요합니다.')
    }
    return [iwsfOrder[(number - 1) % 43]]
  }

  // 빌드 시 원본 폴더명과 UI의 MOIW 표시명 모두 같은 규칙을 사용한다.
  const moiwPackName = packName.replace('プレミアムパック MOIW DAY', 'プレミアムパック DAY')
  const moiwOrder = moiwOrders[moiwPackName]
  if (moiwOrder) {
    if (Object.hasOwn(moiwSrOverrides, filename)) {
      return [...moiwSrOverrides[filename]]
    }
    const day = moiwPackName.match(/^プレミアムパック DAY([12])$/)?.[1]
    if (!day || moiwOrder.length !== 59 || new Set(moiwOrder).size !== 59) {
      throw new Error(`MOIW 카드 연결에는 DAY별 중복 없는 아이돌 ID 59개가 필요합니다: ${packName}`)
    }
    const match = filename.match(new RegExp(`^img_wld_0${day}_(\\d+)\\.webp$`))
    const number = match ? Number(match[1]) : 0
    // R(1~59)·SSR(60~118)은 같은 개인 순서다. SR은 위의 공통 지정표를 사용한다.
    if (number < 1 || number > 118) return undefined
    return [moiwOrder[(number - 1) % 59]]
  }

  const cinderellaOrder = cinderellaOrders[packName]
  if (cinderellaOrder) {
    const volume = packName.match(/^シンデレラガールズver\. vol\.([1-6])$/)?.[1]
    const count = volume === '3' || volume === '6' ? 64 : 63
    if (!volume || cinderellaOrder.length !== count || new Set(cinderellaOrder).size !== count) {
      throw new Error(`신데렐라 걸즈 카드 연결에는 팩별 중복 없는 아이돌 순서가 필요합니다: ${packName}`)
    }
    const pattern = new RegExp(`^img_cg_0${volume}_(\\d+)\\.webp$`)
    const match = filename.match(pattern)
    const number = match ? Number(match[1]) : 0
    // N과 R에 같은 순서를 적용한다. CGR·BCGR은 생성 시 R에서 상속하고 MR은 별도 지정한다.
    if (number < 1 || number > count * 2) return undefined
    return [cinderellaOrder[(number - 1) % count]]
  }

  if (packName === 'SideM ver. vol.1' || packName === 'SideM ver. vol.2') {
    const isVol1 = packName === 'SideM ver. vol.1'
    const idolOrder = isVol1 ? sideMVol1Order : sideMVol2Order
    const units = isVol1 ? sideMVol1Units : sideMVol2Units
    const idolCount = isVol1 ? 24 : 25
    const pattern = isVol1 ? /^img_sidem_01_(\d+)\.webp$/ : /^img_sidem_02_(\d+)\.webp$/
    const match = filename.match(pattern)
    const number = match ? Number(match[1]) : 0
    if (number < 1 || number > idolCount * 2 + 32) return undefined

    const unitMembers = units.flat()
    if (
      idolOrder.length !== idolCount || new Set(idolOrder).size !== idolCount ||
      units.length !== 8 || units.some((unit) => unit.length === 0) ||
      unitMembers.length !== idolCount || new Set(unitMembers).size !== idolCount ||
      unitMembers.some((id) => !idolOrder.includes(id))
    ) {
      throw new Error(`${packName} 카드 연결에는 8개 유닛에 중복·누락 없는 아이돌 ID ${idolCount}개가 필요합니다.`)
    }
    // N·R은 개인 순서를 각 1회, SR·SSR·PSR·MR은 8개 유닛 순서를 각 1회 적용한다.
    if (number <= idolCount * 2) return [idolOrder[(number - 1) % idolCount]]
    return [...units[(number - 1 - idolCount * 2) % 8]]
  }

  if (packName === '学園アイドルマスター ver. vol.1') {
    const match = filename.match(/^img_gkmas_01_(\d+)\.webp$/)
    const number = match ? Number(match[1]) : 0
    // N(1~26)·R(53~78)는 각각 명부의 아이돌 13인 순서를 2회 반복한다.
    // CP(27~52)는 츠바메 제외 12인 → 전체 13인 → 마시로 유우 순서다.
    // MR(79~85)은 위의 파일별 개별 지정표를 사용한다.
    if (number < 1 || number > 78) return undefined
    if (gakuenOrder.length !== 13 || new Set(gakuenOrder).size !== 13 || !gakuenOrder.includes('amaya-tsubame')) {
      throw new Error('학원 아이돌마스터 카드 연결에는 중복 없는 아이돌 ID 13개가 필요합니다.')
    }
    if (number >= 27 && number <= 52) {
      const cpOrder = [
        ...gakuenOrder.filter((id) => id !== 'amaya-tsubame'),
        ...gakuenOrder,
        'mashiro-yu',
      ]
      return [cpOrder[number - 27]]
    }
    return [gakuenOrder[(number - 1) % 13]]
  }

  const shinyColorsRule = shinyColorsRules[packName]
  if (shinyColorsRule) {
    const match = filename.match(shinyColorsRule.filenamePattern)
    const number = match ? Number(match[1]) : 0
    // vol.3의 개인 카드 N/R/SSR은 REFRAC7IONS 그룹·멤버 순서를 따른다.
    const idolOrder = packName === 'シャイニーカラーズver. vol.3'
      ? shinyColorsRefractions.flat()
      : shinyColorsOrder
    let index: number
    if (number >= 1 && number <= 56) {
      // N(1~28)과 R(29~56)에 팩별 28인 순서를 각각 적용한다.
      index = (number - 1) % 28
    } else if (packName === 'シャイニーカラーズver. vol.1' && number >= 57 && number <= 84) {
      index = number - 57
    } else if (packName === 'シャイニーカラーズver. vol.2' && number >= 57 && number <= 64) {
      return [...shinyColorsUnits[number - 57]]
    } else if (packName === 'シャイニーカラーズver. vol.3' && number >= 57 && number <= 63) {
      return [...shinyColorsRefractions[number - 57]]
    } else if (number >= shinyColorsRule.ssrStart && number < shinyColorsRule.ssrStart + 28) {
      index = number - shinyColorsRule.ssrStart
    } else {
      // MR은 위의 파일별 개별 지정표를 사용한다.
      return undefined
    }

    if (idolOrder.length !== 28 || new Set(idolOrder).size !== 28) {
      throw new Error('샤이니 컬러즈 카드 연결에는 중복 없는 아이돌 ID 28개가 필요합니다.')
    }
    return [idolOrder[index]]
  }

  const millionLivePattern = millionLivePatterns[packName]
  if (millionLivePattern) {
    const match = filename.match(millionLivePattern)
    const number = match ? Number(match[1]) : 0

    const liveOrder = millionLiveLiveOrders[packName]
    if (liveOrder && number >= 53 && number <= 52 + liveOrder.length * 2) {
      return [liveOrder[(number - 53) % liveOrder.length]]
    }

    // 기본 팩은 N/R/SR이 각 52인 순서를 반복한다. MLR은 생성 시 SR에서 상속한다.
    // vol.2~4의 N(1~52)은 명부 순서, R/MLR은 위의 라이브 순서를 사용한다.
    const maxNumber = packName === 'ミリオンライブ！ver' ? 156 : 52
    if (number < 1 || number > maxNumber) return undefined

    if (millionLiveOrder.length !== 52 || new Set(millionLiveOrder).size !== 52) {
      throw new Error('밀리언라이브 카드 연결에는 중복 없는 아이돌 ID 52개가 필요합니다.')
    }
    return [millionLiveOrder[(number - 1) % 52]]
  }

  if (packName !== 'アイドルマスターver') return undefined

  const match = filename.match(/^img_(\d+)\.webp$/)
  const number = match ? Number(match[1]) : 0

  if (number >= 1 && number <= 39) {
    return [allStarsOrder[(number - 1) % 13]]
  }
  if (number >= 40 && number <= 53) {
    return [rareOrder[number - 40]]
  }
  if (number >= 54 && number <= 92) {
    return [allStarsOrder[(number - 54) % 13]]
  }
  if (number >= 93 && number <= 106) {
    return [rareOrder[number - 93]]
  }
  if (number === 107) {
    return ['amami-haruka', 'hoshii-miki', 'kisaragi-chihaya']
  }

  throw new Error(`아이돌 연결 규칙이 없는 카드입니다: ${packName}/${filename}`)
}
