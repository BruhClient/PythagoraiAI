import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href={"/"}>
      <Image src={"/logo.svg"} width={30} height={30} alt="logo" />
    </Link>
  );
};

export default Logo;
