"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoginDialog } from "@/components/login";
import { useAuth } from "@/utils/AuthContext";
import { Character } from "./types";
import MarkdownEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";
import useSWR from 'swr'




// Import actions
import { fetchCards, prepopulateCards, loadCardIntoEditor, saveCardEdits } from "./actions";
import { Edit2Icon, EditIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { charactersPercents } from "./const";

export default function CharacterList({ characters }: { characters: Character[] }) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false); // Track editing state
  const [markdownContent, setMarkdownContent] = useState(""); // Track Markdown content
  const [isWindowLoaded, setIsWindowLoaded] = useState(false);
  const [userCards, setUserCards] = useState<any[]>([]);
  const [hasInitializedCards, setHasInitializedCards] = useState(false);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const { data: showPercents, mutate: setShowPercents } = useSWR<boolean>(
    'state:percents',
    {
      fallbackData: false,
    },
  )
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

  async function fetchAndInitializeCards() {
    try {
      const cards = await fetchCards(user.id);
      if (cards.length === 0) {
        console.log("No cards found for user, prepopulating cards...");
        await prepopulateCards(user.id, characters);
        const newCards = await fetchCards(user.id); // Fetch the cards again after prepopulating
        setUserCards(newCards);
      } else {
        setUserCards(cards);
      }
      setHasInitializedCards(true);
    } catch (error) {
      console.error("Error initializing cards:", error);
    }
  }

  function renderCards() {
    const userCardsWithPercents = userCards.map((card) => ({
      ...card,
      percentWindow: charactersPercents.find((c) => c.tracker === card.order_index)?.percentWindow,
      comboMoveType: charactersPercents.find((c) => c.tracker === card.order_index)?.comboMoveType,
    }));
  
    return userCardsWithPercents
      .filter((card) =>
        card.title.toLowerCase().normalize("NFKD").includes(searchTerm.toLowerCase())
      )
      .map((card) => (
        <Card
          key={card.id}
          className="bg-card rounded-lg shadow-md cursor-pointer hover:shadow-lg hover:border hover:border-primary transition-all"
          onClick={async () => {
            setSelectedCharacter(card);
            await loadCardIntoEditorHandler(card.id);
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
            <div className="flex flex-col items-center justify-center font-bold" style={{ minHeight: '80px' }}>
              <h3 className="text-xl mb-2 text-foreground">{card.title}</h3>
              {showPercents && (
                <p className={`flex justify-evenly ${card.comboMoveType === "no-dash" ? "text-green-500" : card.comboMoveType === "dash-first" ? "text-red-500" : "text-gray-500"}`}>
                  {card.percentWindow ? (
                    formatPercentWindow(card.percentWindow)
                  ) : (
                    <span className="text-foreground">N/A</span>
                  )}
                </p>
              )}
            </div>
          </CardHeader>
        </Card>
      ));
  }

  async function loadCardIntoEditorHandler(cardId: any) {
    if (!user) return;

    const cardData = await loadCardIntoEditor(cardId, user.id);
    if (cardData) {
      setMarkdownContent(cardData.content); // Load content in Markdown format
      setSelectedCharacter(cardData);
    }
  }

  async function saveCardEditsHandler(cardId: any) {
    if (!user) {
      console.error("User is not logged in");
      return;
    }

    setLoading(true);

    try {
      await saveCardEdits(cardId, user.id, markdownContent);
      const updatedCards = userCards.map((card) =>
        card.id === cardId ? { ...card, content: markdownContent } : card
      );
      setUserCards(updatedCards);
      setSelectedCharacter({ ...selectedCharacter, content: markdownContent }); // Update the selectedCharacter state
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error("Error updating card:", error);
    } finally {
      setLoading(false);
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
      <div className="absolute top-5 right-10 z-50">
        <LoginDialog />
      </div>
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-3xl font-bold">Smash Bros Character Matchups</h1>
        <div className="mt-4 w-full max-w-md">
          <Input
            placeholder="Search Characters..."
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
            if (open) {
              document.body.style.overflow = 'hidden';
            } else {
              document.body.style.overflow = 'auto';
              setSelectedCharacter(null);
              setIsEditing(false);
            }
          }}
        >
          <DialogContent className="sm:max-w-[1200px] min-h-[500px] max-h-full overflow-y-scroll m-6 bg-card flex flex-col">
            <div className="flex items-center justify-between p-1 m-0 pt-3">
              <h2 className="text-2xl font-bold">{selectedCharacter.title}</h2>
              {user && (
                <Button variant="secondary" onClick={() => setIsEditing(!isEditing)} className="hover:border hover:border-primary bg-background">
                  {isEditing ? "Cancel" : <EditIcon />}

                </Button>
              )}
            </div>
            <div className="w-full h-full flex-grow flex flex-col" data-color-mode={theme === "dark" ? "dark" : "light"}>
              {isEditing && isWindowLoaded ? (
                <>

                  <div className="wmde-markdown-var text-foreground"> </div>
                  <MarkdownEditor
                    value={markdownContent}
                    onChange={(value) => setMarkdownContent(value || "")}
                    height="400px"
                    style={{
                      marginBottom: "16px",
                    }} // Add margin to separate the editor and the button
                    preview="live"
                    previewOptions={{
                      rehypePlugins: [[rehypeSanitize]],
                    }}
                  />
                  <Button onClick={() => saveCardEditsHandler(selectedCharacter.id)} style={{ marginTop: "16px" }}>
                    {loading ? "Loading..." : "Save"}
                  </Button>
                </>
              ) : (
                // Render the content using Markdown preview mode
                <>
                  <div className="wmde-markdown-var"> </div>

                  <MarkdownEditor.Markdown
                    source={selectedCharacter?.content || ""}
                    style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'stretch', }}
                    className="p-5"


                  />
                </>
              )}

            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}