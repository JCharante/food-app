import React, {useEffect, useState} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {trpc} from "../util/api";
import {httpBatchLink} from "@trpc/client";
import {TokenContext} from "../util/tokenContext";
import {RestaurantContext} from "../util/restaurantContext";
import {registerRootComponent} from "expo";
import {StyleSheet} from "react-native";


import { Stack, usePathname } from "expo-router"
import {IRefetchContext, RefetchContext} from "../util/hooks";


export default function App() {
    const pathname = usePathname();
    const [token, setToken] = React.useState('')
    const [restaurant, setRestaurant] = React.useState(null)
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient, setTrpcClient] = useState(() =>
        trpc.createClient({
            transformer: undefined,
            links: [
                httpBatchLink({
                    url: 'http://localhost:3000/trpc',
                }),
            ]
        }),
    );

    const [refetchDetails, setRefetchDetails] = useState<IRefetchContext>({
        url: pathname,
        hasRefetched: false,
        setHasRefetched: (hasRefetched: boolean) => setRefetchDetails(state => ({
            url: state.url,
            hasRefetched,
            setHasRefetched: state.setHasRefetched
        })),
    })

    useEffect(() => {
        setRefetchDetails(state => ({
            url: pathname,
            hasRefetched: false,
            setHasRefetched: state.setHasRefetched
        }))
    }, [pathname])

    useEffect(() => {
        setTrpcClient(() =>
            trpc.createClient({
                transformer: undefined,
                links: [
                    httpBatchLink({
                        url: 'http://localhost:3000/trpc',
                        // optional
                        headers() {
                            return {
                                authorization: `Bearer ${token}`,
                            };
                        },
                    }),
                ]
            }),
        )
    }, [token])

    // @ts-ignore
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <TokenContext.Provider value={{ token, setToken }}>
                    <RestaurantContext.Provider value={{ restaurant, setRestaurant }}>
                        <RefetchContext.Provider value={refetchDetails}>
                            <Stack />
                        </RefetchContext.Provider>
                    </RestaurantContext.Provider>
                </TokenContext.Provider>
            </QueryClientProvider>
        </trpc.Provider>
    );
}

// registerRootComponent(App)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});