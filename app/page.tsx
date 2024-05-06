import CharacterList from "./client"
import type { Character } from "./types"
import { fighters } from './fighter.json'
export const dynamic = 'force-static'

const charactersPercents = [
  { name: "banjo_and_kazooie", comboMoveType: "no-dash", percentWindow: [100, 121] },
  { name: "bayonetta", comboMoveType: "", percentWindow: false },
  { name: "koopa", comboMoveType: "no-dash", percentWindow: [107, 133] },
  { name: "koopa_jr", comboMoveType: "no-dash", percentWindow: [83, 112] },
  { name: "byleth", comboMoveType: "dash-first", percentWindow: [92, 100] },
  { name: "captain_falcon", comboMoveType: "no-dash", percentWindow: [90, 104] },
  { name: "pokemon_trainer:charizard", comboMoveType: "no-dash", percentWindow: [93, 95] },
  { name: "chrom", comboMoveType: "", percentWindow: false },
  { name: "roy", comboMoveType: "", percentWindow: false },
  { name: "cloud", comboMoveType: "no-dash", percentWindow: [85, 100] },
  { name: "kamui", comboMoveType: "no-dash", percentWindow: [84, 102] },
  { name: "diddy_kong", comboMoveType: "", percentWindow: false },
  { name: "donkey_kong", comboMoveType: "no-dash", percentWindow: [94, 133] },
  { name: "dr_mario", comboMoveType: "no-dash", percentWindow: [86, 99] },
  { name: "duck_hunt", comboMoveType: "no-dash", percentWindow: [73, 93] },
  { name: "falco", comboMoveType: "", percentWindow: false },
  { name: "fox", comboMoveType: "dash-first", percentWindow: [76, 79] },
  { name: "ganondorf", comboMoveType: "no-dash", percentWindow: [91, 118] },
  { name: "gekkouga", comboMoveType: "dash-first", percentWindow: [86, 90] },
  { name: "dq_hero", comboMoveType: "dash-first", percentWindow: [85, 86] }, 
  { name: "ice_climber", comboMoveType: "no-dash", percentWindow: [81, 99] },
  { name: "ike", comboMoveType: "no-dash", percentWindow: [88, 112] },
  { name: "gaogaen", comboMoveType: "no-dash", percentWindow: [96, 114] },
  { name: "inkling", comboMoveType: "dash-first", percentWindow: [86, 95] },
  { name: "shizue", comboMoveType: "no-dash", percentWindow: [73, 91] },
  { name: "pokemon_trainer:ivysaur", comboMoveType: "", percentWindow: false },
  { name: "purin", comboMoveType: "no-dash", percentWindow: [52, 89] },
  { name: "joker", comboMoveType: "no-dash", percentWindow: [81, 100] },
  { name: "dedede", comboMoveType: "no-dash", percentWindow: [97, 127] },
  { name: "king_k_rool", comboMoveType: "no-dash", percentWindow: [92, 131] },
  { name: "kirby", comboMoveType: "no-dash", percentWindow: [67, 94] },
  { name: "link", comboMoveType: "", percentWindow: false },
  { name: "little_mac", comboMoveType: "", percentWindow: false },
  { name: "lucario", comboMoveType: "dash-first", percentWindow: [90, 98] },
  { name: "lucas", comboMoveType: "no-dash", percentWindow: [76, 97] },
  { name: "luigi", comboMoveType: "no-dash", percentWindow: [88, false] },
  { name: "mario", comboMoveType: "dash-first", percentWindow: [84, 98] },
  { name: "marth", comboMoveType: "no-dash", percentWindow: [81, 96] },
  { name: "lucina", comboMoveType: "no-dash", percentWindow: [81, 96] },
  { name: "rockman", comboMoveType: "no-dash", percentWindow: [85, 102] },
  { name: "meta_knight", comboMoveType: "dash-first", percentWindow: [81, 87] },
  { name: "mewtwo", comboMoveType: "dash-first", percentWindow: [79, 90] },
  { name: "mii_fighter:brawler", comboMoveType: "", percentWindow: false },
  { name: "mii_fighter:gunner", comboMoveType: "no-dash", percentWindow: [84, 104] },
  { name: "mii_fighter:fighter", comboMoveType: "no-dash", percentWindow: [82, 100] },
  { name: "minmin", comboMoveType: "no-dash", percentWindow: [88, 108] },
  { name: "mr_game_and_watch", comboMoveType: "no-dash", percentWindow: [65, 89] },
  { name: "ness", comboMoveType: "no-dash", percentWindow: [76, 94] },
  { name: "pikmin_and_olimar", comboMoveType: "no-dash", percentWindow: [67, 89] },
  { name: "pac_man", comboMoveType: "no-dash", percentWindow: [76, 97] },
  { name: "palutena", comboMoveType: "", percentWindow: false },
  { name: "peach", comboMoveType: "dash-first", percentWindow: [86, 94] },
  { name: "daisy", comboMoveType: "dash-first", percentWindow: [86, 94] },
  { name: "pichu", comboMoveType: "dash-first", percentWindow: [62, 77] },
  { name: "pikachu", comboMoveType: "dash-first", percentWindow: [79, 84] },
  { name: "kazuya", comboMoveType: "no-dash", percentWindow: [94, 111] },
  { name: "packun_flower", comboMoveType: "no-dash", percentWindow: [83, 104] },
  { name: "pit", comboMoveType: "dash-first", percentWindow: [92, 100] },
  { name: "dark_pit", comboMoveType: "dash-first", percentWindow: [92, 100] },
  { name: "homura", comboMoveType: "no-dash", percentWindow: [84, 100] },
  { name: "richter", comboMoveType: "no-dash", percentWindow: [88, 112] },
  { name: "simon", comboMoveType: "no-dash", percentWindow: [88, 112] },
  { name: "ridley", comboMoveType: "no-dash", percentWindow: [87, 116] },
  { name: "robot", comboMoveType: "no-dash", percentWindow: [80, 99] },
  { name: "reflet", comboMoveType: "no-dash", percentWindow: [83, 100] },
  { name: "rosetta_and_chiko", comboMoveType: "no-dash", percentWindow: [75, 92] },
  { name: "ryu", comboMoveType: "no-dash", percentWindow: [89, 105] },
  { name: "samus", comboMoveType: "no-dash", percentWindow: [92, 110] },
  { name: "dark_samus", comboMoveType: "no-dash", percentWindow: [92, 110] },
  { name: "sephiroth", comboMoveType: "no-dash", percentWindow: [79, 85] },
  { name: "sheik", comboMoveType: "dash-first", percentWindow: [84, 86] },
  { name: "shulk", comboMoveType: "no-dash", percentWindow: [83, 102] },
  { name: "sora", comboMoveType: "dash-first", percentWindow: [76, 94] },
  { name: "snake", comboMoveType: "no-dash", percentWindow: [86, 114] },
  { name: "snake", comboMoveType: "", percentWindow: false },
  { name: "pokemon_trainer:squirtle", comboMoveType: "no-dash", percentWindow: [73, 81] },
  { name: "steve", comboMoveType: "no-dash", percentWindow: [77, 93] },
  { name: "terry", comboMoveType: "no-dash", percentWindow: [91, 109] },
  { name: "toon_link", comboMoveType: "", percentWindow: false },
  { name: "murabito", comboMoveType: "no-dash", percentWindow: [81, 97] },
  { name: "wario", comboMoveType: "no-dash", percentWindow: [81, 108] },
  { name: "wii_fit_trainer", comboMoveType: "no-dash", percentWindow: [83, 101] },
  { name: "wolf", comboMoveType: "", percentWindow: false },
  { name: "yoshi", comboMoveType: "no-dash", percentWindow: [88, 103] },
  { name: "young_link", comboMoveType: "dash-first", percentWindow: [83, 85] },
  { name: "zelda", comboMoveType: "no-dash", percentWindow: [74, 92] },
  { name: "zero_suit_samus", comboMoveType: "", percentWindow: false }

];

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
    <div>
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
