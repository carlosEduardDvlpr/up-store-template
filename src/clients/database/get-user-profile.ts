import { http } from "@/clients/http";
import { User } from "@/data/types/user";

type GetUserProfile = {
  user: User
}

export async function getUserProfile() {
  const response = await http<GetUserProfile>("/api/me", {
    method: "GET",
    next: {
      tags: ["profile"],
    },
  })
  const { user } = response
  return user;
}
