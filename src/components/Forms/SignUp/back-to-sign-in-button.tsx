import { Button } from "@/components/Buttons";
import { useRouter } from "next/navigation";

export function BackToSignInPageButton({ isLoading }: { isLoading: boolean }) {
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/sign-in"); // This will navigate to the login page
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoBack}
      disabled={isLoading}
      className="uppercase"
    >
      Cancelar
    </Button>
  );
}
