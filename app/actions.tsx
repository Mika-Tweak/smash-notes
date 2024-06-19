"use sever";

import supabase from "@/utils/supabase";
import { Character } from "./types";

// Function to fetch cards for a user
export async function fetchCards(userId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("user_id", userId)
      .order("order_index", { ascending: true });

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

// Function to prepopulate cards for a new user
export async function prepopulateCards(userId: string, characters: Character[]) {
  try {
    const defaultCards = characters.map((character, index) => ({
      user_id: userId,
      title: character.displayName.en_US,
      content: `## Table of Contents
1. [Character Notes](#character-notes)
2. [Matchup Notes](#matchup-notes)
3. [Gameplan](#gameplan)



## Character Notes
[Detailed notes about the character's strengths, weaknesses, key moves, and general strategies.]



## Matchup Notes
[Specific notes about the matchup against the opponent's character.]



## Gameplan
[Outline your gameplan, including strategies for neutral game, advantage state, and disadvantage state.]
`, // Default content as an empty string
      order_index: index,
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

// Function to load a specific card into the editor
export async function loadCardIntoEditor(cardId: any, userId: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("id", cardId)
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching card:", error);
      return null;
    } else {
      return data;
    }
  } catch (error) {
    console.error("Error fetching card:", error);
    return null;
  }
}

// Function to save card edits
export async function saveCardEdits(cardId: any, userId: string, content: string) {
  try {
    const { error } = await supabase
      .from("cards")
      .update({ content, updated_at: new Date() })
      .eq("id", cardId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error updating card:", error);
    }
  } catch (error) {
    console.error("Error updating card:", error);
  }
}