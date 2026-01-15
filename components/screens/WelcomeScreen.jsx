import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function WelcomeScreen({ onDone }) {
    const [name, setName] = useState("");

    const isDisabled = name.trim() === "";

    /* ===== Animated Border ===== */
    const borderAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isDisabled) {
            borderAnim.stopAnimation();
            borderAnim.setValue(0);
            return;
        }

        Animated.loop(
            Animated.sequence([
                Animated.timing(borderAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: false,
                }),
                Animated.timing(borderAnim, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, [isDisabled]);

    const animatedBorderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["#27272a", "#e5e7eb"], // zinc-800 → soft white
    });

    const saveName = async () => {
        if (isDisabled) return;

        await AsyncStorage.setItem("userName", name);
        onDone();
    };

    return (
        <SafeAreaView className="flex-1 bg-black px-6">
            {/* ===== TOP LOGO ===== */}
            <View className="mt-10 items-center">
                <Image
                    source={require("../../assets/appName.png")}
                    className="w-60 h-40 mb-4"
                    resizeMode="contain"
                />
                
                {/* ===== APP DESCRIPTION ===== */}
                <Text className="text-center text-zinc-400 text-sm mb-6">
                    Track your expenses quickly and securely. {"\n"}
                    Simple, fast, and private.
                </Text>
            </View>

            {/* ===== INPUT ===== */}
            <View className="flex-1 mt-2">
                <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                    <Text className="text-zinc-400 text-xs mb-2">
                        Your Name
                    </Text>

                    <TextInput
                        placeholder="Enter your name"
                        placeholderTextColor="#666"
                        className="text-white text-base py-2"
                        value={name}
                        onChangeText={setName}
                    />
                </View>
            </View>

            {/* ===== START BUTTON (ANIMATED BORDER) ===== */}
            <View className="mb-8">
                <Animated.View
                    style={{
                        borderRadius: 50,
                        padding: 2,
                        borderWidth: 1,
                        borderColor: isDisabled
                            ? "#27272a"
                            : animatedBorderColor,
                    }}
                >
                    <TouchableOpacity
                        onPress={saveName}
                        disabled={isDisabled}
                        activeOpacity={0.85}
                        className={`rounded-full py-4 ${
                            isDisabled ? "bg-zinc-900" : "bg-black"
                        }`}
                    >
                        <Text
                            className={`text-center text-base font-poppinsExtraBold ${
                                isDisabled
                                    ? "text-zinc-500"
                                    : "text-white"
                            }`}
                        >
                            Start Application
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>

            {/* ===== PREMIUM FILLER ===== */}
            <View className="mb-6">
                <View className="flex-row items-center mb-4">
                    <View className="flex-1 h-px bg-zinc-800" />
                    <Text className="mx-3 text-zinc-500 text-xs">
                        Getting started
                    </Text>
                    <View className="flex-1 h-px bg-zinc-800" />
                </View>

                <Text className="text-center text-zinc-400 text-sm leading-5">
                    Your name is used only to personalize your experience.
                    {"\n"}No account. No signup. No data sharing.
                </Text>
            </View>
        </SafeAreaView>
    );
}
