import CharacterList from "./client"
import type { Character } from "./types"
import { fighters } from './fighter.json'
import { charactersPercents } from "./const"
export const dynamic = 'force-static'




export default async function Page() {
  let characters = fighters.map(fighter => {
    return {
      ...fighter,
      displayName: {
        en_US: fighter.displayName.en_US.replace("<br>", ""),
      },
      comboMoveType: charactersPercents.find(({ name }) => name === fighter.file)?.comboMoveType as any || "",
      percentWindow: charactersPercents.find(({ name }) => name === fighter.file)?.percentWindow as any,
    }
  })

  characters = addMiis(characters) as any

  return (
    <div style={{ marginTop: '4rem' }}>
      <CharacterList characters={characters} />
    </div>
  )
}

function addMiis(fighters: Character[]) {
  fighters = fighters.filter(fighter => fighter.file !== 'mii_fighter')
  const miiFighter = fighters.find(fighter => fighter.file === 'mii_fighter')
  const miiGunner = fighters.find(fighter => fighter.file === 'mii_fighter')
  const miiBrawler = fighters.find(fighter => fighter.file === 'mii_fighter')

  console.log(miiFighter, miiGunner, miiBrawler)

  fighters.push({
    id: 'mii_fighter',
    file: 'mii_fighter',
    displayNum: "0",
    displayNameEn: `Mii Sword-Fighter`,
    comboMoveType:"no-dash",
    percentWindow:[82, 100],
    displayName: {
      en_US: `Mii Sword-Fighter`,
    },
  })


  fighters.push({
    id: 'mii_gunner',
    file: 'mii_fighter',
    displayNum: "0",
    displayNameEn: `Mii Gunner`,
    comboMoveType:"no-dash",
    percentWindow:[84, 104],
    displayName: {
      en_US: `Mii Gunner`,
    },
  })

  fighters.push({
    id: 'mii_brawler',
    file: 'mii_fighter',
    displayNum: "0",
    comboMoveType:"",
    percentWindow: false,
    displayNameEn: `Mii Brawler`,
    displayName: {
      en_US: `Mii Brawler`,
    },
  })

  // fighters.push({
  //   id: 'pokemon_trainer:charizard',
  //   file: 'pokemon_trainer:charizard',
  //   displayNum: "0",
  //   comboMoveType:"no-dash",
  //   percentWindow: false,
  //   displayNameEn: `Mii Brawler`,
  //   displayName: {
  //     en_US: `Mii Brawler`,
  //   },
  // })

  return fighters
}
