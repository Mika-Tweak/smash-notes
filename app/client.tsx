"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoginDialog } from "@/components/login";
import { useAuth } from "@/utils/AuthContext";
import supabase from "@/utils/supabase";
import { Character } from "./types";
import dynamic from "next/dynamic";

import MarkdownEditor from '@uiw/react-md-editor';


export default function CharacterList({ characters }: { characters: Character[] }) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false); // Track editing state
  const [markdownContent, setMarkdownContent] = useState(""); // Track Markdown content
  const [isWindowLoaded, setIsWindowLoaded] = useState(false);
  const [userCards, setUserCards] = useState<any[]>([]);
  const [hasInitializedCards, setHasInitializedCards] = useState(false);

  useEffect(() => {
    setIsWindowLoaded(true);
  }, []);

  useEffect(() => {
    if (user) {
      fetchAndInitializeCards();
    } else {
      resetState();
    }
  }, [user]);

  async function fetchAndInitializeCards() {
    try {
      const cards = await fetchCards();
      if (cards.length === 0) {
        console.log("No cards found for user, prepopulating cards...");
        await prepopulateCards(user.id, characters);
        const newCards = await fetchCards(); // Fetch the cards again after prepopulating
        setUserCards(newCards);
      } else {
        setUserCards(cards);
      }
      setHasInitializedCards(true);
    } catch (error) {
      console.error("Error initializing cards:", error);
    }
  }

  async function fetchCards(): Promise<any[]> {
    try {
      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("user_id", user.id)
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching cards:", error);
        return [];
      } else {
        console.log("Fetched cards:", data);
        return data;
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
      return [];
    }
  }

  async function prepopulateCards(userId: string, characters: Character[]) {
    try {
      const defaultCards = characters.map((character) => ({
        user_id: userId,
        title: character.displayName.en_US,
        content: "", // Default content as an empty string
      }));

      const { error } = await supabase.from("cards").insert(defaultCards);

      if (error) {
        console.error("Error prepopulating cards:", error);
      } else {
        console.log("Cards prepopulated for new user");
      }
    } catch (error) {
      console.error("Error prepopulating cards:", error);
    }
  }

  function renderCards() {
    return userCards
      .filter((card) =>
        card.title.toLowerCase().normalize("NFKD").includes(searchTerm.toLowerCase())
      )
      .map((card) => (
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
              src={`https://www.smashbros.com/assets_v2/img/fighter/thumb_a/${characters.find(
                (c) => c.displayName.en_US === card.title
              )?.file}.png`}
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
    if (!user) {
      return;
    }

    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("id", cardId)
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching card:", error);
    } else {
      setMarkdownContent(data.content); // Load content in Markdown format
      setSelectedCharacter(data);
    }
  }

  const [loading, setLoading] = useState(false)
  async function saveCardEdits(cardId: any) {
    if (!user) {
      console.error("User is not logged in");
      return;
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from("cards")
        .update({ content: markdownContent, updated_at: new Date() })
        .eq("id", cardId)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error updating card:", error);
      } else {
        const updatedCards = userCards.map((card) =>
          card.id === cardId ? { ...card, content: markdownContent } : card
        );
        setUserCards(updatedCards);
        setSelectedCharacter({ ...selectedCharacter, content: markdownContent }); // Update the selectedCharacter state
        setIsEditing(false); // Exit editing mode
      }
    } catch (error) {
      console.error("Error updating card:", error);
    } finally {
      setLoading(false)
    }
  }

  function resetState() {
    setUserCards([]);
    setSelectedCharacter(null);
    setIsEditing(false);
    setMarkdownContent("");
    setHasInitializedCards(false);
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="absolute top-4 right-4 z-50">
        <LoginDialog />
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
      {user ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {renderCards()}
        </div>
      ) : (
        <div className="text-center mt-12">
          <p className="text-lg font-semibold">Please log in to use Smash Notes</p>
        </div>
      )}
      {selectedCharacter && (
        <Dialog
          open={!!selectedCharacter}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedCharacter(null);
              setIsEditing(false);
            }
          }}
        >
          <DialogContent className="sm:max-w-[1200px] sm:min-h-[600px] bg-card flex flex-col">
            <div className="flex items-center justify-between p-0 m-0 pt-6">
              <h2 className="text-2xl font-bold">{selectedCharacter.title}</h2>
              {user && (
                <Button variant="default" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              )}
            </div>
            <div className="w-full h-full flex-grow flex flex-col">
              {isEditing && isWindowLoaded ? (
                <>
                  <MarkdownEditor
                    value={markdownContent}
                    onChange={(value) => setMarkdownContent(value || "")}
                    height="200px"
                    style={{ marginBottom: "16px" }} // Add margin to separate the editor and the button
                    preview="live"
                  />
                  <Button onClick={() => saveCardEdits(selectedCharacter.id)} style={{ marginTop: "16px" }}>
                    {loading ? "Loading..." : "Save"}
                  </Button>
                </>
              ) : (
                // Render the content using Markdown preview mode
                <MarkdownEditor.Markdown
                  source={selectedCharacter?.content || ""}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}