import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileSettings({ width, onBack }) {
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const savedName = await AsyncStorage.getItem("userName");
                if (savedName !== null) setUsername(savedName);
            } catch (e) {
                console.log("Username load failed");
            } finally {
                setIsReady(true);
            }
        })();
    }, []);

    const validateUsername = (value) => {
        if (!value.trim()) return "Username cannot be empty";
        if (value.length > 20) return "Maximum 20 characters allowed";

        // Regex explanation:
        // ^[A-Za-z]+(?: [A-Za-z]+)*$  
        // ^[A-Za-z]+      -> starts with letters  
        // (?: [A-Za-z]+)* -> zero or more groups of a single space followed by letters  
        // $               -> end of string
        const regex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
        if (!regex.test(value)) return "Only single spaces allowed between names";
        return "";
    };

    const handleSave = async () => {
        const validationError = validateUsername(username);
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            await AsyncStorage.setItem("userName", username);
            onBack();
        } catch (e) {
            setError("Failed to save username");
        }
    };

    if (!isReady) return null;

    return (
        <View style={{ width }} className="flex-1 bg-black">
            {/* Header */}
            <View className="px-5 py-3 flex-row items-center border-b border-zinc-800">
                <TouchableOpacity onPress={onBack}>
                    <Ionicons name="arrow-back" size={22} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-lg ml-4 font-semibold">
                    Profile
                </Text>
            </View>

            {/* Content */}
            <View className="px-5 pt-8">
                <Text className="text-sm text-zinc-400 mb-3">
                    Profile Settings
                </Text>

                <View
                    className="rounded-3xl p-5"
                    style={{
                        backgroundColor: "#1c1c1e",
                        shadowColor: "#000",
                        shadowOpacity: 0.4,
                        shadowRadius: 20,
                        shadowOffset: { width: 0, height: 10 },
                        elevation: 10,
                    }}
                >
                    <Text className="text-zinc-400 text-xs mb-2">
                        Username
                    </Text>

                    <TextInput
                        value={username}
                        onChangeText={(text) => {
                            setUsername(text);
                            setError("");
                        }}
                        placeholder="Enter your username"
                        placeholderTextColor="#71717a"
                        className="rounded-2xl px-4 py-4 text-white mb-3"
                        style={{ backgroundColor: "#2c2c2e" }}
                    />

                    {error ? (
                        <Text className="text-red-500 text-xs mb-3">{error}</Text>
                    ) : null}

                    <TouchableOpacity
                        onPress={handleSave}
                        className="rounded-full py-3 items-center bg-emerald-500"
                    >
                        <Text className="font-semibold text-base font-poppinsBold">
                            Save Changes
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
