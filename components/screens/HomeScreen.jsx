import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TransactionDetailModal from "components/components/TransactionDetailModal";
import { groupTransactionsByDate } from "components/utils/dateUtils";
import EmptyTransactions from "components/components/EmptyTransactions";
import AppLoader from "components/components/AppLoader";

const formatNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? "0" : num.toLocaleString();
};


export default function HomeScreen() {
    const navigation = useNavigation();

    const [transactions, setTransactions] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [currency, setCurrency] = useState("")
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [showTick, setShowTick] = useState(false);


    // Load transactions from AsyncStorage
    const loadTransactions = useCallback(async () => {
        try {
            setLoading(true);
            const stored = await AsyncStorage.getItem("transactions");
            const parsed = stored ? JSON.parse(stored) : [];
            setTransactions(parsed);

            // Check if a new transaction was just added
            const recentlyAdded = await AsyncStorage.getItem("recentlyAddedTransaction");
            if (recentlyAdded === "true") {
                setShowTick(true);
                setTimeout(() => setShowTick(false), 2000);
                await AsyncStorage.removeItem("recentlyAddedTransaction");
            }

            let actualCurrency = await AsyncStorage.getItem("currency");
            if (!actualCurrency) {
                actualCurrency = "Rs.";
                await AsyncStorage.setItem("currency", actualCurrency);
            }
            setCurrency(actualCurrency);
        } catch (error) {
            console.log("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    }, []);



    // Load username ONCE
    useEffect(() => {
        (async () => {
            try {
                const savedName = await AsyncStorage.getItem("userName");
                setUsername(savedName);

            } catch (e) {
                console.log("Username load failed");
            }
        })();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadTransactions();
        }, [loadTransactions])
    );


    const incomeTotal = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const expenseTotal =
        transactions
            .filter(t => t.type === "expense")
            .reduce((sum, t) => sum + Number(t.amount || 0), 0)
        +
        transactions
            .filter(t => t.type === "borrow")
            .reduce((sum, t) => sum + Number(t.paidAmount || 0), 0);

    const borrowTotal = transactions
        .filter(t => t.type === "borrow")
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const borrowRepaidTotal = transactions
        .filter(t => t.type === "borrow")
        .reduce((sum, t) => sum + Number(t.paidAmount || 0), 0);

    const totalBalance = incomeTotal - expenseTotal;


    const getStyles = (type) => {
        switch (type) {
            case "income":
                return { bg: "bg-green-500/20", color: "text-green-500", icon: "arrow-down" };
            case "borrow":
                return { bg: "bg-orange-500/20", color: "text-orange-400", icon: "repeat" };
            default:
                return { bg: "bg-red-500/20", color: "text-red-500", icon: "arrow-up" };
        }
    };

    // Get date-grouped sections (Today / Yesterday / Actual Date)
    const sections = useMemo(() => {
        const limited = [...transactions]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);

        return groupTransactionsByDate(limited);
    }, [transactions]);



    // Edit transaction
    const handleEdit = async (updatedTx) => {
        try {
            const stored = await AsyncStorage.getItem("transactions");
            const list = stored ? JSON.parse(stored) : [];

            const updatedList = list.map(tx => tx.id === updatedTx.id ? updatedTx : tx);

            await AsyncStorage.setItem("transactions", JSON.stringify(updatedList));

            setTransactions(updatedList);
        } catch (e) {
            console.log("Edit failed", e);
        }
    };

    // Delete transaction
    const handleDelete = async (txToDelete) => {
        try {
            const stored = await AsyncStorage.getItem("transactions");
            const list = stored ? JSON.parse(stored) : [];

            const filtered = list.filter(tx => tx.id !== txToDelete.id);

            await AsyncStorage.setItem("transactions", JSON.stringify(filtered));

            setTransactions(filtered);
            setModalVisible(false);
        } catch (e) {
            console.log("Delete failed", e);
        }
    };




    if (transactions.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-black">
                {/* HEADER */}
                <View className="px-4 pt-2 flex-row justify-between items-center">
                    <View className="flex flex-row items-center justify-between w-full">
                        <View className="">
                            <Text className="text-gray-400 text-xs">Welcome back</Text>
                            <Text className="text-white text-xl font-poppinsBold uppercase">
                                {username}
                            </Text>
                        </View>
                        <View className="flex flex-row items-center">
                            <TouchableOpacity
                                onPress={() => navigation.navigate("CloseMonth")}
                                className="mr-4"
                            >
                                <Ionicons name="calendar-clear-outline" size={22} color="#10b981" />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                                <Ionicons name="settings-outline" size={22} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <EmptyTransactions
                    onAdd={() => navigation.navigate("AddTransaction")}
                    transactions={transactions}
                />
            </SafeAreaView>
        );
    }


    return (
        <View className="flex-1">
            <SafeAreaView className="flex-1 bg-black">
                <AppLoader visible={loading} />
                {/* HEADER */}
                <View className="px-4 pt-2 flex-row justify-between items-center">
                    <View>
                        <Text className="text-gray-400 text-xs">Welcome back</Text>
                        <Text className="text-white text-xl font-poppinsBold uppercase">{username}</Text>
                    </View>
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={() => navigation.navigate("CloseMonth")}
                            className="mr-4"
                        >
                            <Ionicons name="calendar-clear" size={22} color="#10b981" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                            <Ionicons name="settings-outline" size={22} color="white" />
                        </TouchableOpacity>
                    </View>

                </View>

                {/* BALANCE CARD */}
                <View className="mx-4 mt-4 bg-zinc-900 border border-zinc-700 rounded-3xl p-5">

                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-4">
                        <View>
                            <Text className="text-zinc-400 text-xs font-poppinsMedium">
                                Available Balance
                            </Text>
                            <Text className="text-white text-3xl font-poppinsBold mt-1">
                                {currency} {formatNumber(totalBalance)}
                            </Text>
                        </View>

                        <View className="border-2 border-emerald-600 p-1 rounded-full">
                            <TouchableOpacity
                                onPress={() => navigation.navigate("AddTransaction")}
                                className="bg-emerald-500 px-4 py-4 rounded-full"
                            >
                                <Text className="text-white font-poppinsBold text-xl">
                                    {/* <Ionicons color={"black"} name="add-sharp" size={25}  />
                                     */}
                                    <MaterialIcons
                                        name={showTick ? "check" : "add"}
                                        size={26}
                                        color="black"
                                    />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Divider */}
                    <View className="h-px bg-white/10 mb-4" />

                    {/* ONE ROW STATS */}
                    <View className="flex-row justify-between">

                        {/* Income */}
                        <View className="flex-1 items-center">
                            <Text className="text-zinc-400 text-xs mb-1">
                                Income
                            </Text>
                            <Text className="text-green-500 font-poppinsBold text-sm">
                                {currency} {formatNumber(incomeTotal)}
                            </Text>
                        </View>

                        {/* Vertical Divider */}
                        <View className="w-px bg-white/10 mx-2" />

                        {/* Expense */}
                        <View className="flex-1 items-center">
                            <Text className="text-zinc-400 text-xs mb-1">
                                Expense
                            </Text>
                            <Text className="text-red-500 font-poppinsBold text-sm">
                                {currency} {formatNumber(expenseTotal)}
                            </Text>
                        </View>

                        {/* Vertical Divider */}
                        <View className="w-px bg-white/10 mx-2" />

                        {/* Borrow */}
                        <View className="flex-1 items-center">
                            <Text className="text-zinc-400 text-xs mb-1">
                                Borrow
                            </Text>
                            <Text className="text-orange-400 font-poppinsBold text-sm">
                                {currency} {formatNumber(borrowTotal - borrowRepaidTotal)}
                            </Text>
                        </View>

                    </View>
                </View>


                {/* ACTIVITY HEADER */}
                <View className="px-4 mt-6 mb-2 flex-row justify-between items-center">
                    <Text className="text-white text-sm font-poppinsSemiBold">Recent Activity</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("AllTransactions")}>
                        <Text className="text-gray-400 text-sm">See all</Text>
                    </TouchableOpacity>
                </View>

                {/* ACTIVITY LIST */}
                <FlatList
                    data={sections}
                    keyExtractor={(_, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
                    renderItem={({ item }) => (
                        <>
                            {item.data.length > 0 && (
                                <>
                                    <Text className="text-gray-400 text-xs mt-4 mb-2 font-poppinsSemiBold">
                                        {item.title}
                                    </Text>
                                    {item.data.map(tx => {
                                        const style = getStyles(tx.type);
                                        // const remaining = tx.type === "borrow" ? (tx.amount - (tx.paidAmount || 0)) : tx.amount;
                                        return (
                                            <TouchableOpacity
                                                key={tx.id}
                                                activeOpacity={0.85}
                                                onPress={() => {
                                                    setSelectedTransaction(tx);
                                                    setModalVisible(true);
                                                }}
                                                className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 mb-2"
                                            >
                                                <View className="flex-row items-center">

                                                    {/* ICON */}
                                                    <View
                                                        className={`w-10 h-10 rounded-full items-center justify-center ${style.bg}`}
                                                    >
                                                        <Ionicons
                                                            name={style.icon}
                                                            size={17}
                                                            color={
                                                                tx.type === "borrow"
                                                                    ? "#fb923c"
                                                                    : tx.type === "income"
                                                                        ? "#22c55e"
                                                                        : "#f02e2e"
                                                            }
                                                        />
                                                    </View>

                                                    {/* CENTER TEXT */}
                                                    <View className="flex-1 ml-3 pr-2">
                                                        <Text
                                                            className="text-white font-poppinsMedium text-sm"
                                                            numberOfLines={1}
                                                            ellipsizeMode="tail"
                                                        >
                                                            {tx.title}
                                                        </Text>

                                                        <Text
                                                            className="text-gray-400 text-xs mt-0.5"
                                                            numberOfLines={1}
                                                            ellipsizeMode="tail"
                                                        >
                                                            {tx.subtitle || "—"}
                                                        </Text>
                                                    </View>

                                                    {/* RIGHT AMOUNT + PAID INFO */}
                                                    <View className="items-end min-w-[100px] justify-center">
                                                        {/* MAIN AMOUNT */}
                                                        <Text
                                                            className={`font-poppinsBold text-base ${tx.type === "borrow"
                                                                ? "text-orange-400"
                                                                : tx.type === "income"
                                                                    ? "text-emerald-400"
                                                                    : "text-red-500"
                                                                }`}
                                                        >
                                                            {currency} {formatNumber(tx.amount)}
                                                        </Text>

                                                        {/* PAID AMOUNT (BORROW ONLY) */}
                                                        {tx.type === "borrow" && tx.paidAmount > 0 ? (
                                                            <View className="mt-1 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                                                                <Text className="text-emerald-400 text-[8px] font-poppinsMedium">
                                                                    Paid {currency} {formatNumber(tx.paidAmount)}
                                                                </Text>
                                                            </View>
                                                        ) : (
                                                            <Text className="text-gray-500 text-[10px] uppercase mt-1">
                                                                {tx.type}
                                                            </Text>
                                                        )}
                                                    </View>

                                                </View>
                                            </TouchableOpacity>

                                        );
                                    })}
                                </>
                            )}
                        </>
                    )}
                />

                {/* TRANSACTION MODAL */}
                <TransactionDetailModal
                    visible={modalVisible}
                    transaction={selectedTransaction}
                    onClose={() => setModalVisible(false)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    currency={currency}
                />

            </SafeAreaView>

        </View>
    );
}
