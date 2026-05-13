"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface TeamMemberInput {
  name: string;
  slug: string;
  role_es: string;
  role_en: string;
  bio_es: string;
  bio_en: string;
  image_url: string | null;
  sort_order: number;
  published: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function createTeamMember(input: TeamMemberInput) {
  const supabase = await createClient();
  const slug = input.slug || slugify(input.name);

  const { data, error } = await supabase
    .from("team_members")
    .insert({ ...input, slug })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/equipo");
  revalidatePath("/admin/equipo");
  redirect(`/admin/equipo/${data.id}`);
}

export async function updateTeamMember(
  id: string,
  input: Partial<TeamMemberInput>,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("team_members")
    .update(input)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/equipo");
  revalidatePath("/admin/equipo");
  revalidatePath(`/admin/equipo/${id}`);
  return { success: true };
}

export async function deleteTeamMember(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("team_members").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/equipo");
  revalidatePath("/admin/equipo");
  redirect("/admin/equipo");
}
