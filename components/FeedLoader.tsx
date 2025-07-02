import { Loader2 } from "lucide-react";
import React from "react";

const FeedLoader = () => {
  return (
    <Loader2 className="animate-spin  mx-auto" size={20} aria-label="Loading" />
  );
};

export default FeedLoader;
