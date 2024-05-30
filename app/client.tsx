"use client"

import { Input } from "@/components/ui/input"
import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Character } from "./types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { LoginDialog } from "@/components/login" 

export default function CharacterList({ characters }: {
  characters: Character[]
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null)

  const filteredCharacters = characters.filter((character) =>
    character.displayName.en_US.toLowerCase().normalize("NFKD").includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto py- 8 px-4 md:px-6">
      <LoginDialog/>
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-3xl font-bold">Smash Bros Character Matchups</h1>
        <div className="mt-4 w-full max-w-md">
          <Input
            placeholder="Search characters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCharacters.map((character) => (
          <Card
            key={character.displayName.en_US}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedCharacter(character)}
          >
            <CardHeader className="p-0">
              <Image
                src={`https://www.smashbros.com/assets_v2/img/fighter/thumb_a/${character.file}.png`}
                alt={character.displayName.en_US}
                width={300}
                height={300}
                className="rounded-t-lg w-full h-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{character.displayName.en_US}</h3>
                <p className={`${character.comboMoveType === "no-dash" ?
                  "text-green-500" : character.comboMoveType === "dash-first" ?
                    "text-red-500" : "text-gray-500"} font-bold`}>
                  {character.comboMoveType ? formatPercentWindow(character.percentWindow) : "N/A"}
                </p> 
              </div>
            </CardHeader>
            <CardContent>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedCharacter && (
        <Dialog open={!!selectedCharacter} onOpenChange={setSelectedCharacter}>
          <DialogContent className="w-full max-w-md">
            <div className="flex items-center mb-4">
              <Image
                src={`https://www.smashbros.com/assets_v2/img/fighter/thumb_h/${selectedCharacter.file}.png`}
                alt={selectedCharacter.name}
                width={100}
                height={100}
                className="rounded-lg absolute inset-0 w-full h-full object-cover z-1"
              />
              <h2 className="text-2xl font-bold z-10 drop-shadow-[0_1.2px_1.2px_rgba(255,255,255,0.8)]">{selectedCharacter.displayName.en_US}</h2>
            </div>
            {/* <p className="mb-4">{selectedCharacter.description}</p> */}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function formatPercentWindow(percentWindow: Character['percentWindow']) {
  if (Array.isArray(percentWindow)) {
    const firstValue = percentWindow[0]
    const secondValue = percentWindow[1]

    if (firstValue === secondValue) {
      return `${firstValue}%`
    }

    return `${firstValue}% - ${secondValue ? `${secondValue}%` : "var"}`
  }

  return percentWindow
}