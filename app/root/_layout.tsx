import { Slot, Tabs, Stack } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';

import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config.js'
import {tw} from "../../util/utilities";

// @ts-ignore
const twConfig = resolveConfig(tailwindConfig)

export default function HomeLayout() {
    return <Tabs screenOptions={{ tabBarStyle: tw`rounded-tl-2xl rounded-tr-2xl`, tabBarItemStyle: tw`p-1`}}>
        <Tabs.Screen name="home/index" options={{
            tabBarLabel: 'Home',
            tabBarIcon: ((props: {
                focused: boolean;
                color: string;
                size: number;
            }) => <Ionicons name={props.focused ? 'home' : 'home-outline'}
                            size={24}
                            color={props.focused ? twConfig.theme.colors.primary[600] : twConfig.theme.colors.neutral[600]} />)
        }}  />
        <Tabs.Screen name="orders/index" options={{
            title: 'Orders',
            tabBarLabel: 'Orders',
            tabBarIcon: ((props: {
                focused: boolean;
                color: string;
                size: number;
            }) => <Ionicons name={props.focused ? 'document-text' : 'document-text-outline'}
                            size={24}
                            color={props.focused ? twConfig.theme.colors.primary[600] : twConfig.theme.colors.neutral[600]} />)
        }}  />
        <Tabs.Screen name="help/index" options={{
            title: 'Help',
            tabBarLabel: 'Help',
            tabBarIcon: ((props: {
                focused: boolean;
                color: string;
                size: number;
            }) => <Ionicons name={props.focused ? 'chatbubbles' : "chatbubbles-outline"}
                            size={24}
                            color={props.focused ? twConfig.theme.colors.primary[600] : twConfig.theme.colors.neutral[600]} />)
        }}  />
        <Tabs.Screen name="me/index" options={{
            title: 'Me',
            tabBarLabel: 'Me',
            tabBarIcon: ((props: {
                focused: boolean;
                color: string;
                size: number;
            }) => <Ionicons name={props.focused ? 'person-circle' : "person-circle-outline"}
                            size={24}
                            color={props.focused ? twConfig.theme.colors.primary[600] : twConfig.theme.colors.neutral[600]} />)
        }}  />
    </Tabs>
}