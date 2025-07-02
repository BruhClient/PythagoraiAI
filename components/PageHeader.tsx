import React from "react";

const PageHeader = ({
  title,

  subtext,
}: {
  title: string;
  subtext: string;
}) => {
  return (
    <div className="space-y-1">
      <div className="font-bold text-3xl flex gap-1 break-all">{title}</div>
      <div className="font-serif text-muted-foreground text-sm">{subtext}</div>
    </div>
  );
};

export default PageHeader;
