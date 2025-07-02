import ForgetPasswordForm from "@/components/forms/auth/ForgotPasswordForm";
import Logo from "@/components/common/Logo";
import UserAvatar from "@/components/common/UserAvatar";
import { Rating } from "@/components/common/Ratings";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <ForgetPasswordForm />
        </div>
      </div>
      <div className="lg:flex lg:w-[60vw] h-screen hidden justify-center items-center px-3 ">
        <div className="flex flex-col gap-2">
          <div className="font-bold text-4xl text-muted-foreground leading-3">
            "
          </div>
          <div className="text-3xl font-bold max-w-[800px] text-bold">
            This is my new secret weapon for exams. I’ve recommended it to
            everyone in my study group.
          </div>
          <div className="font-bold text-4xl text-muted-foreground leading-3 pt-2 self-end">
            "
          </div>
          <div className="self-start">
            <div className="flex gap-2 items-center">
              <UserAvatar imageUrl="/default.png" />

              <div className="text-lg font-bold">Grace W.</div>
              <div>
                <Rating value={4} readOnly />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-4 left-4">
        <Logo />
      </div>
    </div>
  );
}
