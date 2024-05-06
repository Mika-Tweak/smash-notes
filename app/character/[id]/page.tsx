import { fighters } from '@/app/fighter.json'
import Image from 'next/image'

export default function CharacterPage({ params }: {
    params: {
        id: string;
    };
}) {
    const character = fighters.find((fighter) => fighter.id === params.id);
    if (!character) {
        return <div>Character not found</div>;
    }

    return (
        <div>
            <h1>{character.displayNameEn}</h1>
            <Image src={`https://www.smashbros.com/assets_v2/img/fighter/thumb_a/${character.file}.png`} alt={character.displayNameEn} width={200} height={200} />
        </div>
    );
}