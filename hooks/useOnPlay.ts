import { Song } from "@/types";
import usePlayer from "./usePlayer";
import useAuthModal from "./useAuthModal";
import { useUser } from "./useUser";

const useOnPlay = (songs: Song[]) => {
	const player = usePlayer();
	const authModal = useAuthModal();
	const { user } = useUser();

	const onPlay = (id: string) => {
		if (!user) return authModal.onOpen();

		// UnComment to Only Allow Subscribed User to Play Song.
		// if (!subscription) return subscribeModal.onOpen();

		player.setId(id);
		player.setIds(songs.map((song) => song.id));
	};

	return onPlay;
};

export default useOnPlay;
