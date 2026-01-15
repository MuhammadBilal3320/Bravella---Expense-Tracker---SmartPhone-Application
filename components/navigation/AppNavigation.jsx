import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import HomeScreen from "components/screens/HomeScreen";
import AllTransactionsScreen from "components/screens/AllTransactionsScreen";
import AddTransactionScreen from "components/screens/AddTransactionScreen";
import SettingsScreen from "components/screens/setting/SettingsScreen";
import CloseMonthScreen from "components/screens/ClosedMonthsScreen";


const Stack = createNativeStackNavigator();

export default function AppNavigation() {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
                detachPreviousScreen: false,
            }}
        >
            {/* HOME */}
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ animation: "slide_from_left" }}
            />

            {/* ALL TRANSACTIONS */}
            <Stack.Screen
                name="AllTransactions"
                component={AllTransactionsScreen}
                options={{
                    animation: "slide_from_right",
                    stackPresentation: "push",
                    gestureEnabled: true,
                    gestureDirection: "horizontal",
                }}
            />

            {/* ADD TRANSACTION */}
            <Stack.Screen
                name="AddTransaction"
                component={AddTransactionScreen}
                options={{
                    animation: "slide_from_right",
                    stackPresentation: "push",
                    gestureEnabled: true,
                    gestureDirection: "horizontal",
                }}
            />

            <Stack.Screen
                name="CloseMonth"
                component={CloseMonthScreen}
                options={{
                    animation: "slide_from_right",
                    stackPresentation: "push",
                    gestureEnabled: true,
                    gestureDirection: "horizontal",
                }}
            />


            {/* SETTINGS */}
            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    animation: "slide_from_right",
                    stackPresentation: "push",
                    gestureEnabled: true,
                    gestureDirection: "horizontal",
                }}
            />

        </Stack.Navigator>

    );
}
