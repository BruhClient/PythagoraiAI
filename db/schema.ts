import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  index,
  real,
  jsonb,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  isOauth: boolean("isOauth").notNull().default(false),
  hashedPassword: text("hashedPassword"),
  gems: integer("gems").notNull().default(5),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
    {
      userIdIdx: index("accounts_user_id_idx").on(account.userId),
    },
  ]
);

export const sessions = pgTable(
  "session",
  {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("sessions_user_id_idx").on(session.userId),
  })
);

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    emailReplaced: text("emailReplaced"),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
);

export const codeVerificationTokens = pgTable("codeVerificationToken", {
  identifier: text("identifier").notNull().primaryKey(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
  code: text("code").notNull(),
});

export const folders = pgTable(
  "folders",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull(),
    color: text("color").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  },
  (folders) => ({
    userIdIdx: index("folders_user_id_idx").on(folders.userId),
    createdAtIdx: index("folders_created_at_idx").on(folders.createdAt),
    userCreatedAtIdx: index("folders_user_created_at_idx").on(
      folders.userId,
      folders.createdAt
    ),
  })
);

export const decks = pgTable(
  "decks",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull(),
    icon: text("icon").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    color: text("color").notNull(),
    folderId: text("folderId")
      .notNull()
      .references(() => folders.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
    totalReviewedCards: integer("totalReviewedCards").notNull().default(0),
  },
  (decks) => ({
    userIdIdx: index("decks_user_id_idx").on(decks.userId),
    folderIdIdx: index("decks_folder_id_idx").on(decks.folderId),
    createdAtIdx: index("decks_created_at_idx").on(decks.createdAt),
  })
);

export const cards = pgTable(
  "cards",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    deckId: text("deckId")
      .notNull()
      .references(() => decks.id, { onDelete: "cascade" }),
    front: text("front").notNull(),
    back: text("back").notNull(),
    pdfUrl: text("pdfUrl"),
    isAi: boolean("isAi").default(false),
    relevantText: text("relevantText"),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
    easeFactor: real("ease_factor").notNull().default(2.5),
    interval: integer("interval").notNull().default(1),
    repetitions: integer("repetitions").notNull().default(0),
    dueDate: timestamp("dueDate").notNull().defaultNow(),
    isDue: boolean("isDue").notNull().default(true),
    totalQuality: integer("totalQuality").notNull().default(0),
    mastery: real("mastery").notNull(),
  },
  (cards) => ({
    userIdIdx: index("cards_user_id_idx").on(cards.userId),
    deckIdIdx: index("cards_deck_id_idx").on(cards.deckId),
    isDueIdx: index("cards_is_due_idx").on(cards.isDue),
    dueDateIdx: index("cards_due_date_idx").on(cards.dueDate),
  })
);

export const reviews = pgTable(
  "reviews",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    deckId: text("deckId")
      .notNull()
      .references(() => decks.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
    results: jsonb("results").notNull(),
    maxCards: integer("maxCards").notNull(),
  },
  (reviews) => ({
    userIdIdx: index("reviews_user_id_idx").on(reviews.userId),
    deckIdIdx: index("reviews_deck_id_idx").on(reviews.deckId),
    createdAtIdx: index("reviews_created_at_idx").on(reviews.createdAt),
  })
);
