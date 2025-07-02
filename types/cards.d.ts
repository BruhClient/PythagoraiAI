// types/cards.ts

export interface Card {
  id: string;
  front: string;
  back: string;
  deckId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  // add any other card fields
}

export interface CardPaginationCursor {
  cursorCreatedAt: string;
  cursorId: string;
}

export interface CardPaginationResponse {
  data: Card[];
  nextCursor: CardPaginationCursor | null;
}
