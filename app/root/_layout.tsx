import { Slot, Tabs, Stack } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';

export default function HomeLayout() {
    return <Tabs>
        <Tabs.Screen name="home/index" options={{
            tabBarLabel: 'Home',
            tabBarIcon: ((props: {
                focused: boolean;
                color: string;
                size: number;
            }) => <Ionicons name="home-outline" size={24} color={props.focused ? '#2AC3EC' : 'black'} />)
        }}  />
        <Tabs.Screen name="orders/index" options={{
            title: 'Orders',
            tabBarLabel: 'Orders',
            tabBarIcon: ((props: {
                focused: boolean;
                color: string;
                size: number;
            }) => <Ionicons name="document-text-outline" size={24} color={props.focused ? '#2AC3EC' : 'black'} />)
        }}  />
        <Tabs.Screen name="help/index" options={{
            title: 'Help',
            tabBarLabel: 'Help',
            tabBarIcon: ((props: {
                focused: boolean;
                color: string;
                size: number;
            }) => <Ionicons name="chatbubbles-outline" size={24} color={props.focused ? '#2AC3EC' : 'black'} />)
        }}  />
        <Tabs.Screen name="me/index" options={{
            title: 'Me',
            tabBarLabel: 'Me',
            tabBarIcon: ((props: {
                focused: boolean;
                color: string;
                size: number;
            }) => <Ionicons name="person-circle-outline" size={24} color={props.focused ? '#2AC3EC' : 'black'} />)
        }}  />
    </Tabs>
}