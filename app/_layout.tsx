import React, {useEffect, useState} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {baseURL, trpc} from "../util/api";
import {httpBatchLink} from "@trpc/client";
import {TokenContext} from "../util/tokenContext";
import {RestaurantContext} from "../util/restaurantContext";
import {registerRootComponent} from "expo";
import {StyleSheet} from "react-native";
import { Stack, usePathname } from "expo-router"
import {IRefetchContext, LanguageSwitcherContext, RefetchContext} from "../util/hooks";
import en from "../translations/en.json";
import vi from "../translations/vi.json"
import {IntlProvider} from "react-intl";
import { getLocales } from 'expo-localization'

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
                    url: baseURL + '/trpc',
                    headers: () => {
                        return {
                            'ngrok-skip-browser-warning': 'any'
                        }
                    }
                }),
            ],
        }),
    );

    // TODO: save locale to async storage to persist between app launches
    const [locale, setLocale] = useState(() => {
        const deviceLanguage = getLocales()[0].languageCode
        if (!deviceLanguage.startsWith("en") && !deviceLanguage.startsWith("vi")) {
            return "en"
        }
        return deviceLanguage.split('-')[0]
    })


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
                        url: baseURL + '/trpc',
                        // optional
                        headers() {
                            return {
                                'ngrok-skip-browser-warning': 'any',
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
                            <IntlProvider locale={locale} messages={locale === 'en' ? en : vi}>
                                <LanguageSwitcherContext.Provider value={{locale, setLocale}}>
                                    <Stack>
                                        <Stack.Screen name="modal" options={{presentation: "modal"}}/>
                                        <Stack.Screen name="root" options={{headerShown: false}}/>
                                    </Stack>
                                </LanguageSwitcherContext.Provider>
                            </IntlProvider>
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