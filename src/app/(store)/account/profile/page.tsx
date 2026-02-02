import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { getUser } from "@/lib/database";
import { NewUpdateProfileFormData } from "@/components/Forms/Profile";
import { ProfileComponent } from "./profile-component";
import { REFRESH_TOKEN } from "@/data/constants";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(REFRESH_TOKEN);
  const bearer = token?.value;

  const user = await getUser();

  if (!user) {
    return (
      <div>
        <p>Carregando...</p>
      </div>
    );
  }

  async function updateProfile(data: NewUpdateProfileFormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get("refreshToken");
    const bearer = token?.value;

    try {
      await fetch(`${baseUrl}/api/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer}`,
        },
        body: JSON.stringify(data),
      });

      revalidateTag("profile", "layer");
    } catch (error) {
      console.error(error);
    }
  }

  if (!bearer) {
    return <div>Usuário não autenticado</div>;
  }

  return (
    <div>
      <ProfileComponent user={user} onUpdateProfile={updateProfile} />
    </div>
  );
}
