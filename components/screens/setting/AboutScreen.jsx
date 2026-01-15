import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const AboutScreen = ({ width, onBack }) => {
    return (
        <View className="flex-1 bg-black">
            
            {/* ===== Header ===== */}
            <View className="px-5 py-3 flex-row items-center border-b border-zinc-800">
                <TouchableOpacity onPress={onBack} className="p-1">
                    <Ionicons name="arrow-back" size={22} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-lg ml-4 font-poppinsSemiBold">
                    About
                </Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
                
                {/* ===== App Name ===== */}
                <View className="mb-6 items-center">
                    <Text className="text-white text-3xl font-poppinsExtraBold">
                        Bravella
                    </Text>
                    <Text className="text-zinc-500 text-xs mt-1 font-poppins">
                        Smart Expense Tracking
                    </Text>
                </View>

                {/* ===== App Description ===== */}
                <View className="mb-8">
                    <Text className="text-zinc-400 text-center text-sm leading-relaxed font-poppins">
                        Welcome to{" "}
                        <Text className="text-white font-poppinsSemiBold">
                            Bravella
                        </Text>
                        ! Manage your personal finances, track income & expenses,
                        and achieve your financial goals effortlessly.
                    </Text>
                </View>

                {/* ===== Features Card ===== */}
                <View className="bg-zinc-900 rounded-2xl p-5 mb-6 shadow-md">
                    <Text className="text-white text-lg mb-3 font-poppinsSemiBold">
                        Features
                    </Text>

                    <View className="space-y-2">
                        <View className="flex-row items-center">
                            <Ionicons
                                name="checkmark-circle"
                                size={16}
                                color="#22c55e"
                            />
                            <Text className="text-zinc-400 text-sm ml-2 font-poppins">
                                Track income and expenses easily
                            </Text>
                        </View>

                        <View className="flex-row items-center">
                            <Ionicons
                                name="checkmark-circle"
                                size={16}
                                color="#22c55e"
                            />
                            <Text className="text-zinc-400 text-sm ml-2 font-poppins">
                                Categorize your transactions
                            </Text>
                        </View>

                        <View className="flex-row items-center">
                            <Ionicons
                                name="checkmark-circle"
                                size={16}
                                color="#22c55e"
                            />
                            <Text className="text-zinc-400 text-sm ml-2 font-poppins">
                                View reports and summaries
                            </Text>
                        </View>

                        <View className="flex-row items-center">
                            <Ionicons
                                name="checkmark-circle"
                                size={16}
                                color="#22c55e"
                            />
                            <Text className="text-zinc-400 text-sm ml-2 font-poppins">
                                Set budgets and stay on track
                            </Text>
                        </View>
                    </View>
                </View>

                {/* ===== App Info Card ===== */}
                <View className="bg-zinc-900 rounded-2xl p-5 mb-6 shadow-md">
                    <Text className="text-white text-lg mb-3 font-poppinsSemiBold">
                        App Info
                    </Text>

                    <Text className="text-zinc-400 text-sm mb-1 font-poppins">
                        Version: 1.0.0
                    </Text>

                    <Text className="text-zinc-400 text-sm mb-3 font-poppins">
                        Developed by Muhammad Bilal
                    </Text>

                    <TouchableOpacity
                        className="flex-row items-center bg-emerald-500 px-4 py-2 rounded-full w-fit"
                        onPress={() =>
                            Linking.openURL("mailto:bilal.x3320@gmail.com")
                        }
                    >
                        <Ionicons name="mail" size={16} color="#fff" />
                        <Text className="text-white ml-2 text-sm font-poppinsSemiBold">
                            Contact Me
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* ===== Footer ===== */}
                <View className="items-center mt-6">
                    <Text className="text-zinc-500 text-xs font-poppins">
                        © 2026 Bravella
                    </Text>
                </View>

            </ScrollView>
        </View>
    );
};

export default AboutScreen;
