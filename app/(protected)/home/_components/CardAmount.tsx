import CountUp from "@/components/react-bits/CountUp";
import { db } from "@/db";
import { cards } from "@/db/schema";
import { sql } from "drizzle-orm";
import React from "react";
import { BsCardText } from "react-icons/bs";

const CardAmount = async ({ userId }: { userId: string }) => {
  const result = await db.execute(sql`
  SELECT COUNT(*) AS count
  FROM ${cards}
  WHERE "userId" = ${userId}
`);
  const count = Number(result.rows[0].count);

  return (
    <div className="flex justify-between w-full items-center bg-card p-3 rounded-lg shadow-lg">
      <div>
        <div className="text-muted-foreground">Total Cards</div>
        <CountUp
          from={0}
          to={count}
          separator=","
          direction="up"
          duration={1}
          className="count-up-text"
        />
      </div>

      <div className="bg-primary p-3 w-fit rounded-lg h-fit">
        <BsCardText className="text-black" size={20} />
      </div>
    </div>
  );
};

export default CardAmount;
