import { User } from "@supabase/auth-helpers-nextjs";
import {
	useSessionContext,
	useUser as useSupaUser,
} from "@supabase/auth-helpers-react";
import { createContext, useContext, useEffect, useState } from "react";

import { Subscription, UserDetails } from "@/types";

type UserContextType = {
	accesstoken: string | null;
	user: User | null;
	user_details: UserDetails | null;
	isLoading: boolean;
	subscription: Subscription | null;
};

export const UserContext = createContext<UserContextType | undefined>(
	undefined
);

export interface Props {
	[propname: string]: any;
}

export const MyUserContextProvider = (props: Props) => {
	const {
		session,
		isLoading: isLoadingUser,
		supabaseClient: supabase,
	} = useSessionContext();

	const user = useSupaUser();
	const accesstoken = session?.access_token ?? null;
	const [isLoadingData, setIsLoadingData] = useState(false);
	const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
	const [subscription, setSubscription] = useState<Subscription | null>(null);

	const getUserDetails = () => supabase.from("user").select("*").single();

	const getSubscritption = () =>
		supabase
			.from("subscriptions")
			.select("*,prices(*, products(*))")
			.in("status", ["trialing", "active"])
			.single();

	useEffect(() => {
		if (user && !isLoadingData && !userDetails && !subscription) {
			setIsLoadingData(true);

			Promise.allSettled([getUserDetails(), getSubscritption()]).then(
				(results) => {
					const userDetailsPromise = results[0];
					const subscriptionPromise = results[1];

					if (userDetailsPromise.status === "fulfilled") {
						setUserDetails(userDetailsPromise.value.data as UserDetails);
					}

					if (subscriptionPromise.status === "fulfilled") {
						setSubscription(subscriptionPromise.value.data as Subscription);
					}

					setIsLoadingData(false);
				}
			);
		} else if (!user && !isLoadingUser && !isLoadingData) {
			setUserDetails(null);
			setSubscription(null);
		}
	}, [user, isLoadingUser]);

	const value = {
		accesstoken,
		user,
		userDetails,
		isLoading: isLoadingUser || isLoadingData,
		subscription,
	};

	return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error("useUser must be used within the MyUserContextProvider ");
	}
	return context;
};
