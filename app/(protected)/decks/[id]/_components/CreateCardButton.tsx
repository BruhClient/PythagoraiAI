import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

const CreateCardButton = ({ id }: { id: string }) => {
  return (
    <Button variant={"outline"} asChild>
      <Link href={`/create?deckId=${id}`}>
        <Plus />
        Create Card
      </Link>
    </Button>
  );
};

export default CreateCardButton;
