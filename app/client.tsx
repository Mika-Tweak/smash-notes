"use client"

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { LoginDialog } from "@/components/login";
import { useAuth } from '@/utils/AuthContext';
import supabase from '@/utils/supabase';
import ReactMarkdown from 'react-markdown';
import { Character } from "./types";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill';

export default function CharacterList({ characters }: { characters: Character[] }) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false); // Track editing state
  const quillRef = useRef<ReactQuill>(null);
  const [quillContent, setQuillContent] = useState(''); // Track Quill content
  const [isWindowLoaded, setIsWindowLoaded] = useState(false);
  const [userCards, setUserCards] = useState<any[]>([]);
  const [hasInitializedCards, setHasInitializedCards] = useState(false);

  useEffect(() => {
    setIsWindowLoaded(true);
  }, []);

  useEffect(() => {
    if (user && !hasInitializedCards) {
      fetchCards().then((cards) => {
        setUserCards(cards);
        setHasInitializedCards(true);
      });
    }
  }, [user, hasInitializedCards]);

  async function fetchCards(): Promise<any[]> {
    try {
      console.log('Fetching cards for user:', user.id);
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', user.id)
        .order('id', { ascending: true });
      
      if (error) {
        console.error('Error fetching cards:', error);
        return [];
      } else if (data.length === 0) {
        console.log('No cards found for user, prepopulating cards...');
        await prepopulateCards(user.id, characters);
        const newCards = await fetchCards(); // Fetch the cards again after prepopulating
        return newCards;
      } else {
        console.log('Fetched cards:', data);
        return data;
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
      return [];
    }
  }

  async function prepopulateCards(userId: any, characters: Character[]) {
    try {
      const defaultCards = characters.map((character) => ({
        user_id: userId,
        title: character.displayName.en_US,
        content: {} // Default content
      }));

      const { data, error } = await supabase
        .from('cards')
        .insert(defaultCards);
      
      if (error) {
        console.error('Error prepopulating cards:', error);
      } else {
        console.log('Cards prepopulated for new user:', data);
      }
    } catch (error) {
      console.error('Error prepopulating cards:', error);
    }
  }

  function renderCards() {
    return userCards.filter((card) =>
      card.title.toLowerCase().normalize("NFKD").includes(searchTerm.toLowerCase())
    ).map((card) => (
      <Card
        key={card.id}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => {
          setSelectedCharacter(card);
          loadCardIntoEditor(card.id);
        }}
      >
        <CardHeader className="p-0">
          <Image
            src={`https://www.smashbros.com/assets_v2/img/fighter/thumb_a/${characters.find((c) => c.displayName.en_US === card.title)?.file}.png`}
            alt={card.title}
            width={300}
            height={300}
            className="rounded-t-lg w-full h-full object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2">{card.title}</h3>
          </div>
        </CardHeader>
      </Card>
    ));
  }

  async function loadCardIntoEditor(cardId: any) {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('id', cardId)
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching card:', error);
    } else {
      if (quillRef.current) {
        quillRef.current.getEditor().setContents(data.content); // Assuming `content` is in Delta format
        setQuillContent(data.content); // Update the Quill content state
        setSelectedCharacter(data);
      }
    }
  }

  async function saveCardEdits(cardId: any) {
    if (!quillRef.current || !quillRef.current.getEditor) {
      console.error('Quill editor is not initialized');
      return;
    }

    try {
      console.log('Saving card with ID:', cardId);
      const delta = quillRef.current.getEditor().getContents(); // Get content in Delta format
      const markdown = deltaToMarkdown(delta); // Convert Delta to Markdown

      const { data, error } = await supabase
        .from('cards')
        .update({ content: markdown, updated_at: new Date() })
        .eq('id', cardId)
        .eq('user_id', user.id)
        .select()
        

      if (error) {
        console.error('Error updating card:', error);
      } else {
        console.log('Card updated successfully:', data);
        setSelectedCharacter({ ...data, content: markdown }); // Update the selectedCharacter state
        setIsEditing(false); // Exit editing mode
      }
    } catch (error) {
      console.error('Error updating card:', error);
    }
  }

  function deltaToMarkdown(delta: any) {
    // Convert Quill Delta to Markdown
    if (typeof document !== 'undefined') {
      const quill = new Quill(document.createElement('div'));
      quill.setContents(delta);
      return quill.root.innerHTML;
    } else {
      return '';
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="absolute top-4 right-4 z-50">
        <LoginDialog/>
      </div>
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-3xl font-bold">Smash Bros Character Matchups</h1>
        <div className="mt-4 w-full max-w-md">
          <Input
            placeholder="Search cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {renderCards()}
      </div>
      {selectedCharacter && (
        <Dialog open={!!selectedCharacter} onOpenChange={(open) => { if (!open) { setSelectedCharacter(null); setIsEditing(false); } }}>
          <DialogContent className="w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{selectedCharacter.title}</h2>
              <Button variant="default" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </div>
            {isEditing && isWindowLoaded ? (
              <>
                <ReactQuill ref={quillRef} value={quillContent} onChange={(content) => setQuillContent(content)} />
                <Button onClick={() => saveCardEdits(selectedCharacter.id)}>Save</Button>
              </>
            ) : (
              <ReactMarkdown>{typeof selectedCharacter.content === 'string' ? selectedCharacter.content : JSON.stringify(selectedCharacter.content)}</ReactMarkdown>
            )}
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