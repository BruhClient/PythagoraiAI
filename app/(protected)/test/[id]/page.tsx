import { db } from "@/db";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Params from "./_components/Params";
import { decks, folders } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { auth } from "@/lib/auth";
const TestPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const session = await auth();

  if (!session) {
    redirect("/home");
  }
  const deck = await db
    .select({ name: decks.title, id: decks.id, folderId: decks.folderId })
    .from(decks)
    .where(and(eq(decks.id, id), eq(decks.userId, session.user.id)));

  if (deck.length === 0) {
    redirect("/folders");
  }

  const folder = await db
    .select({ name: folders.title, id: folders.id })
    .from(folders)
    .where(
      and(eq(folders.id, deck[0].folderId), eq(folders.userId, session.user.id))
    );

  if (folder.length === 0) {
    redirect("/folders");
  }
  return (
    <div>
      <div className="flex items-center">
        <Button size={"icon"} asChild>
          <Link href={`/decks/${id}`}>
            <ChevronLeft />
          </Link>
        </Button>
        <Breadcrumb className="flex-1 flex justify-center">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/home">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/folders/${folder[0].id}`}>
                {folder[0].name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/decks/${deck[0].id}`}>
                {deck[0].name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Params deckId={id} />
    </div>
  );
};

export default TestPage;
