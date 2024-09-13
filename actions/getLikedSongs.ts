import { Song } from "@/types";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getLikedSongs = async (): Promise<Song[]> => {
	const supabase = createServerComponentClient({
		cookies: cookies,
	});

	const {
		data: { session },
	} = await supabase.auth.getSession();

	// Specify the correct foreign key relationship explicitly
	const { data, error } = await supabase
		.from("liked_songs")
		.select("*, songs!liked_songs_song_id_fkey(*)") // specify the foreign key here
		.eq("user_id", session?.user?.id)
		.order("created_at", { ascending: false });

	if (error) {
		console.error(error);
		return [];
	}

	if (!data) return [];

	return data.map((item) => ({
		...item.songs,
	}));
};

export default getLikedSongs;
