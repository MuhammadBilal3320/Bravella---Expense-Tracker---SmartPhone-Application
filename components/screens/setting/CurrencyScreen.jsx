import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const currencyList = [
    { code: "Rs.", name: "Pakistani Rupee" },
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "INR", name: "Indian Rupee" },
    { code: "AED", name: "UAE Dirham" },
    { code: "SAR", name: "Saudi Riyal" },
    { code: "JPY", name: "Japanese Yen" },
];

export default function CurrencyView({ width, selected, onBack, onSelect }) {
    const [customCurrency, setCustomCurrency] = useState("");

    const handleCustomSelect = () => {
        if (customCurrency.trim()) {
            onSelect(customCurrency.trim());
            setCustomCurrency("");
        }
    };

    return (
        <View style={{ width }} className="flex-1 bg-black">
            {/* Header */}
            <View className="px-5 py-3 flex-row items-center border-b border-zinc-800">
                <TouchableOpacity onPress={onBack}>
                    <Ionicons name="arrow-back" size={22} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-lg ml-4 font-semibold">
                    Select Currency
                </Text>
            </View>

            <ScrollView
                className="px-5 py-3"
                showsVerticalScrollIndicator={false}
            >
                {/* Currency List */}
                {currencyList.map((item) => {
                    const isActive = selected === item.code;

                    return (
                        <TouchableOpacity
                            key={item.code}
                            onPress={() => onSelect(item.code)}
                            className={`flex-row justify-between items-center px-4 py-3 mt-2 rounded-xl border ${
                                isActive
                                    ? "border-green-500 bg-green-500/10 shadow-lg"
                                    : "border-zinc-800 bg-zinc-900 shadow-sm"
                            }`}
                        >
                            <View>
                                <Text className="text-white text-sm font-medium">
                                    {item.code}
                                </Text>
                                <Text className="text-zinc-400 text-xs mt-0.5">
                                    {item.name}
                                </Text>
                            </View>

                            {isActive && (
                                <Ionicons
                                    name="checkmark-circle"
                                    size={22}
                                    color="#22c55e"
                                />
                            )}
                        </TouchableOpacity>
                    );
                })}

                {/* Custom Currency */}
                <View className="mt-5 mb-8">
                    <Text className="text-zinc-400 text-xs mb-2">
                        Add Custom Currency
                    </Text>

                    <View className="flex-row items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2">
                        <TextInput
                            value={customCurrency}
                            onChangeText={setCustomCurrency}
                            placeholder="e.g. ₿ , MYR , ₨"
                            placeholderTextColor="#71717a"
                            className="flex-1 text-white text-sm"
                        />

                        <TouchableOpacity
                            onPress={handleCustomSelect}
                            className="ml-3"
                        >
                            <Ionicons name="add-circle" size={24} color="#22c55e" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
