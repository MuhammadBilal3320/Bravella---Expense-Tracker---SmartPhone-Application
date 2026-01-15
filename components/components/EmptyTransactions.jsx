import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EmptyTransactions({ onAdd }) {
    const [isNewMonth, setIsNewMonth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let timeout;

        (async () => {
            try {
                const storedMonths = await AsyncStorage.getItem("closedMonths");
                const closedMonths = storedMonths ? JSON.parse(storedMonths) : [];

                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();

                const currentMonthClosed = closedMonths.some(m => {
                    const closedDate = new Date(m.closedAt);
                    return (
                        closedDate.getMonth() === currentMonth &&
                        closedDate.getFullYear() === currentYear
                    );
                });

                setIsNewMonth(!currentMonthClosed);

            } catch (e) {
                console.log("Failed to check closed months", e);
                setIsNewMonth(false);
            } finally {
                // Ensure loading lasts at least 1 second to prevent flicker
                timeout = setTimeout(() => setLoading(false), 150);
            }
        })();

        return () => clearTimeout(timeout);
    }, []);

    if (loading) return null; // still optional: can show a spinner if you want

    const title = "A New Chapter Awaits";
    const subtitle = "Start tracking your money with clarity.\nEverything for this month will appear here.";


    return (
        <View className="flex-1 justify-center items-center px-6 pt-20">
            <View className="w-full bg-zinc-900/90 border border-white/10 rounded-3xl px-6 py-10 items-center">
                <View className="relative mb-6">
                    <View className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl" />
                    <View className="w-24 h-24 rounded-full bg-black border border-white/10 items-center justify-center">
                        <Ionicons name="wallet-outline" size={42} color="#34D399" />
                    </View>
                </View>

                <Text className="text-white text-xl font-poppinsBold mb-2 text-center">
                    {title}
                </Text>

                <Text className="text-gray-400 text-sm text-center leading-5 mb-8">
                    {subtitle}
                </Text>

                <TouchableOpacity
                    onPress={onAdd}
                    activeOpacity={0.85}
                    className="flex-row items-center bg-emerald-500 px-8 py-4 rounded-full"
                >
                    <MaterialIcons name="add" size={22} color="black" />
                    <Text className="text-black font-poppinsBold ml-2 text-sm">
                        Add Transaction
                    </Text>
                </TouchableOpacity>

                <Text className="text-gray-500 text-[11px] mt-4 text-center">
                    You can edit or delete transactions anytime
                </Text>
            </View>
        </View>
    );
}
