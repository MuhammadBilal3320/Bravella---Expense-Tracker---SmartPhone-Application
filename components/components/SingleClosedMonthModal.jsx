import React, { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, Pressable, FlatList, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DeleteClosedMonthConfirmModal from "./DeleteClosedMonthConfirmModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { exportClosedMonthPDF } from "components/utils/pdfExport";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SingleClosedMonthModal({ visible, onClose, data, onDeleteMonth }) {

    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
    const [currency, setCurrency] = useState("Rs.");


    useEffect(() => {
        (async () => {
            try {
                const storedCurrency = await AsyncStorage.getItem("currency");
                if (storedCurrency) setCurrency(storedCurrency);
            } catch (e) {
                console.log("Failed to load currency", e);
            }
        })();
    }, []);

    if (!data) return null;

    const balance = data.income - data.expense;
    const transactions = data.transactions || [];


    // Format currency, fallback to "Rs. "
    const formatCurrency = (value) => `${currency} ${Number(value).toLocaleString()}`;


    return (

            <Modal transparent onRequestClose={onClose} animationType="slide" visible={visible}>
                <SafeAreaView className="flex-1">
                    <Pressable onPress={onClose} className="flex-1 bg-black/60 justify-end" />

                    <View className="bg-zinc-900 rounded-t-3xl p-6 max-h-[90%]">

                        {/* Header */}
                        <View className="flex-row justify-between items-center mb-4">
                            <Text style={{ fontFamily: "Poppins_600SemiBold" }} className="text-white text-lg">{data.month}</Text>
                            {/* PDF ICON */}
                            <View className="flex flex-row gap-5 items-center">
                                <TouchableOpacity onPress={() =>
                                    exportClosedMonthPDF({
                                        month: data.month,
                                        transactions: data.transactions,
                                        income: data.income,
                                        expense: data.expense,
                                        borrow: data.borrow,
                                        balance: balance,
                                        currency: currency
                                    })
                                }>
                                    <Ionicons name="document-text-outline" size={25} color="white" />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={onClose}>
                                    <Ionicons name="close" size={25} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Summary with Delete button and totals below */}
                        <View className="bg-zinc-900 rounded-3xl p-5 mb-6 border border-zinc-700">

                            {/* HEADER */}
                            <View className="flex-row items-center justify-between mb-4">
                                <View>
                                    <Text className="text-zinc-400 text-xs font-poppinsMedium">
                                        Total Closed Balance
                                    </Text>
                                    <Text className="text-white text-3xl font-poppinsBold mt-1">
                                        {formatCurrency(balance, data.currency)}
                                    </Text>
                                </View>

                                <View className="border-2 border-red-600 p-1 rounded-full">
                                    <TouchableOpacity
                                        onPress={() => setDeleteConfirmVisible(true)}
                                        className="bg-red-500 px-4 py-3 rounded-full"
                                    >
                                        <Text className="text-black font-poppinsBold text-sm">
                                            Delete
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* DIVIDER */}
                            <View className="h-px bg-white/10 mb-4" />

                            {/* ONE ROW STATS */}
                            <View className="flex-row justify-between">

                                {/* Income */}
                                <View className="flex-1 items-center">
                                    <Text className="text-zinc-400 text-xs mb-1 font-poppinsMedium">
                                        Income
                                    </Text>
                                    <Text className="text-green-500 font-poppinsBold text-sm">
                                        {formatCurrency(data.income, data.currency)}
                                    </Text>
                                </View>

                                {/* Vertical Divider */}
                                <View className="w-px bg-white/10 mx-2" />

                                {/* Expense */}
                                <View className="flex-1 items-center">
                                    <Text className="text-zinc-400 text-xs mb-1 font-poppinsMedium">
                                        Expense
                                    </Text>
                                    <Text className="text-red-500 font-poppinsBold text-sm">
                                        {formatCurrency(data.expense, data.currency)}
                                    </Text>
                                </View>

                                {/* Vertical Divider */}
                                <View className="w-px bg-white/10 mx-2" />

                                {/* Borrow */}
                                <View className="flex-1 items-center">
                                    <Text className="text-zinc-400 text-xs mb-1 font-poppinsMedium">
                                        Borrow
                                    </Text>
                                    <Text className="text-orange-400 font-poppinsBold text-sm">
                                        {formatCurrency(data.borrow, data.currency)}
                                    </Text>
                                </View>

                            </View>
                        </View>

                        {/* Transactions */}
                        <Text style={{ fontFamily: "Poppins_600SemiBold" }} className="text-white text-sm mb-3">All Transactions</Text>

                        {transactions.length === 0 ? (
                            <Text style={{ fontFamily: "Poppins_400Regular" }} className="text-zinc-500 text-center mb-4">
                                No transactions available.
                            </Text>
                        ) : (
                            <FlatList
                                data={transactions}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={{ paddingBottom: 20 }}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => {
                                    const dateObj = new Date(item.date);
                                    return (
                                        <View className="bg-zinc-800 p-2 rounded-xl mb-2 border border-white/10">
                                            <View className="flex-row justify-between mb-1">
                                                <Text style={{ fontFamily: "Poppins_500Medium" }} className="text-white">{item.title}</Text>
                                                <Text style={{ fontFamily: "Poppins_600SemiBold" }} className={item.type === "income" ? "text-green-400" : item.type === "expense" ? "text-red-500" : "text-orange-400"}>
                                                    {item.type === "income" ? `+${formatCurrency(item.amount, data.currency)}` : formatCurrency(item.amount, data.currency)}
                                                </Text>
                                            </View>
                                            <Text style={{ fontFamily: "Poppins_400Regular" }} className="text-zinc-400 text-[10px]">
                                                {dateObj.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}{" "}
                                                {dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                                            </Text>
                                        </View>
                                    );
                                }}
                            />
                        )}

                    </View>
                </SafeAreaView>
                <DeleteClosedMonthConfirmModal
                    visible={deleteConfirmVisible}
                    month={data.month}
                    onCancel={() => setDeleteConfirmVisible(false)}
                    onConfirm={() => {
                        onDeleteMonth(data.id);
                        setDeleteConfirmVisible(false);
                        onClose(); // optional: close main modal
                    }}
                />

            </Modal>

    );
}
