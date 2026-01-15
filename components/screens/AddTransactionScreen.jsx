import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    BackHandler,
    Alert,
    Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TYPES = {
    income: { label: "Income", icon: "arrow-down", color: "#22c55e" },
    expense: { label: "Expense", icon: "arrow-up", color: "#ef4444" },
    borrow: { label: "Borrow", icon: "repeat", color: "#fb923c" },
};

export default function AddTransactionScreen() {
    const navigation = useNavigation();

    const [type, setType] = useState("expense");
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [amount, setAmount] = useState("");
    const [addExpense, setAddExpense] = useState(true);
    const [error, setError] = useState("");


    const cfg = TYPES[type];

    const validateInput = () => {
        // reset previous error
        setError("");

        // TITLE
        if (!title || !title.trim()) {
            return "Title is required";
        }

        if (title.trim().length < 2) {
            return "Title must be at least 2 characters";
        }

        // AMOUNT
        if (!amount || !amount.trim()) {
            return "Amount is required";
        }

        // allow only numbers & decimals
        if (!/^\d+(\.\d{1,2})?$/.test(amount.trim())) {
            return "Enter a valid amount";
        }

        const numericAmount = Number(amount);

        if (isNaN(numericAmount)) {
            return "Amount must be a number";
        }

        if (numericAmount <= 0) {
            return "Amount must be greater than zero";
        }

        if (numericAmount > 1_000_000_000) {
            return "Amount is too large";
        }

        // BORROW SPECIFIC RULES
        if (type === "borrow") {
            if (addExpense !== true && addExpense !== false) {
                return "Invalid borrow type";
            }
        }

        return null;
    };


    const save = async () => {
        const validationError = validateInput();

        if (validationError) {
            setError(validationError);
            return;
        }

        const numericAmount = Number(amount);

        const newTransaction = {
            id: Date.now().toString(),
            type,
            title: title.trim(),
            subtitle: subtitle.trim(),
            amount: numericAmount,
            addExpense: type === "borrow" ? addExpense : undefined,
            paidAmount: type === "borrow" ? 0 : undefined,
            date: new Date().toISOString(),
        };

        try {
            const stored = await AsyncStorage.getItem("transactions");
            const transactions = stored ? JSON.parse(stored) : [];

            transactions.unshift(newTransaction);
            await AsyncStorage.setItem(
                "transactions",
                JSON.stringify(transactions)
            );

            await AsyncStorage.setItem("recentlyAddedTransaction", "true");

            setError("");
            navigation.navigate("Home");
        } catch (e) {
            setError("Could not save transaction. Please try again.");
        }
    };

    useEffect(() => {
        const backAction = () => {
            if (navigation.canGoBack()) {
                navigation.navigate("Home");
                return true;
            }
            return false;
        };
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    }, [navigation]);

    return (
        <SafeAreaView className="flex-1 bg-black">
            {/* HEADER */}
            <View className="px-5 py-3 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-poppinsBold">
                    Add Transaction
                </Text>
                <View className="w-6" />
            </View>

            {error ? (
                <View className="mx-5 mt-3 mb-2 bg-red-500/15 border border-red-500/30 rounded-2xl px-4 py-3 flex-row items-start">
                    <Ionicons name="alert-circle" size={20} color="#ef4444" />
                    <Text className="text-red-400 ml-3 flex-1 font-poppinsMedium">
                        {error}
                    </Text>
                    <TouchableOpacity onPress={() => setError("")}>
                        <Ionicons name="close" size={18} color="#ef4444" />
                    </TouchableOpacity>
                </View>
            ) : null}


            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* TYPE SELECT */}
                <View className="flex-row px-5 mt-4 mb-6">
                    {Object.entries(TYPES).map(([key, t]) => {
                        const active = type === key;
                        return (
                            <TouchableOpacity
                                key={key}
                                onPress={() => setType(key)}
                                className="flex-1 mx-1 rounded-2xl py-3 items-center bg-zinc-900"
                            >
                                <Ionicons
                                    name={t.icon}
                                    size={18}
                                    color={active ? t.color : "#71717a"}
                                />
                                <Text
                                    className={`mt-1 text-sm font-poppinsMedium ${active ? "text-white" : "text-gray-400"
                                        }`}
                                >
                                    {t.label}
                                </Text>
                                {active && (
                                    <View
                                        className="h-1 w-8 rounded-full mt-2"
                                        style={{ backgroundColor: t.color }}
                                    />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* FORM */}
                <View className="mx-5 bg-zinc-900 rounded-3xl p-4 mb-8">
                    <Text className="text-gray-400 text-xs mb-1">Title</Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="e.g. Food, Salary"
                        placeholderTextColor="#71717a"
                        className="text-white font-poppinsMedium mb-4"
                    />

                    <View className="h-px bg-zinc-800 mb-4" />

                    <Text className="text-gray-400 text-xs mb-1">Description</Text>
                    <TextInput
                        value={subtitle}
                        onChangeText={setSubtitle}
                        placeholder="Optional"
                        placeholderTextColor="#71717a"
                        className="text-white font-poppinsMedium mb-4"
                    />

                    <View className="h-px bg-zinc-800 mb-4" />

                    <Text className="text-gray-400 text-xs mb-1">Amount</Text>
                    <View className="flex-row items-center">
                        <Text className="text-gray-400 mr-1 text-lg">Rs.</Text>
                        <TextInput
                            value={amount}
                            onChangeText={(text) => {
                                if (/^\d*\.?\d*$/.test(text)) {
                                    setAmount(text);
                                }
                            }}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor="#71717a"
                            className="flex-1 text-white text-3xl"
                            style={{ fontFamily: "sans-serif-medium", fontWeight: "bold" }}
                        />
                    </View>
                </View>

                {/* SAVE BUTTON */}
                <View className="p-1 mx-5 rounded-full border border-white">
                    <TouchableOpacity
                        onPress={save}
                        className="py-3 rounded-full flex-row items-center justify-center gap-2"
                        style={{ backgroundColor: cfg.color }}
                    >
                        <Ionicons name="checkmark" size={20} color="black" />
                        <Text className="text-black font-poppinsBold text-lg">
                            Save Transaction
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
