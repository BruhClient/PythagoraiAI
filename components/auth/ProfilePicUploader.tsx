"use client";

import React, { useRef, useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { useSession } from "next-auth/react";
import { ClipLoader } from "react-spinners";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { updateUserById } from "@/server/db/users";
import { deleteFileFromUploadthing } from "@/server/actions/uploadthing";
import { Button } from "../ui/button";

const ProfilePicUploader = ({
  initialImage,
  id,
}: {
  initialImage: string | null;
  id: string;
}) => {
  const { startUpload } = useUploadThing("imageUploader");

  const [isPending, startTransition] = useTransition();

  const { update } = useSession();

  const [image, setImage] = useState(initialImage);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0] as File;

    if (file) {
      startTransition(async () => {
        const resp = await startUpload([file]);

        if (!resp) {
          return;
        }
        const { ufsUrl, key } = resp[0];

        const prevProfilePicKey = localStorage.getItem("profilePicKey");

        console.log("PREV PROFILE KEY", prevProfilePicKey);
        if (prevProfilePicKey) {
          await deleteFileFromUploadthing(prevProfilePicKey);
        }
        localStorage.setItem("profilePicKey", key);

        const data = await updateUserById(id, {
          image: ufsUrl,
        });

        if (data) {
          setImage(ufsUrl);
          showSuccessToast("Profile Uploaded");
        } else {
          showErrorToast();
        }

        update();
      });
    }
  };
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="flex items-center flex-col gap-3  w-fit">
      <Avatar className="w-32 h-32 pointer-events-auto relative ">
        {isPending && (
          <div className="w-full h-full bg-black absolute opacity-50 flex justify-center items-center z-50">
            <ClipLoader color="white" className="opacity-100" />
          </div>
        )}
        <AvatarImage
          src={image ?? ""}
          className="object-cover "
          alt="@profile"
        />
        <AvatarFallback>
          <User />
        </AvatarFallback>
      </Avatar>
      <>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={isPending}
          className="hidden"
        />
        <Button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          variant={"outline"}
        >
          Edit Photo
        </Button>
      </>
    </div>
  );
};

export default ProfilePicUploader;
