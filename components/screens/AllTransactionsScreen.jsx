import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    SectionList,
    TouchableOpacity,
    BackHandler,
    TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import TransactionDetailModal from "components/components/TransactionDetailModal";
import BottomSheetModal from "components/components/SortingFilteringModal";
import { groupTransactionsByDate } from "components/utils/dateUtils";
import AppLoader from "components/components/AppLoader";

const formatNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? "0" : num.toLocaleString();
};


export default function AllTransactionsScreen() {
    const navigation = useNavigation();

    const [transactions, setTransactions] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [currency, setCurrency] = useState("Rs.");

    // SEARCH / SORT / FILTER / DATE
    const [searchQuery, setSearchQuery] = useState("");
    const [sortType, setSortType] = useState("newest");
    const [filterType, setFilterType] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [sheetVisible, setSheetVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadTransactions = async () => {
        try {
            setLoading(true);
            const stored = await AsyncStorage.getItem("transactions");
            const parsed = stored ? JSON.parse(stored) : [];
            const normalized = parsed.map(t => ({
                ...t,
                amount: Number(t.amount || 0),
                paidAmount: Number(t.paidAmount || 0),
            }));

            setTransactions(normalized);


            const actualCurrency = await AsyncStorage.getItem("currency");
            if (actualCurrency) setCurrency(actualCurrency);
        } catch (e) {
            console.log("Failed to load transactions", e);
        }finally {
        setLoading(false);
    }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadTransactions();
        }, [])
    );

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

    // Filter + Sort transactions
    const getFilteredSortedTransactions = () => {
        const today = new Date();

        return transactions
            .filter((t) => {
                const q = searchQuery.trim().toLowerCase();
                const matchSearch =
                    t.title?.toLowerCase().includes(q) ||
                    t.subtitle?.toLowerCase().includes(q);

                const matchFilter = filterType === "all" ? true : t.type === filterType;

                // Date filtering
                let matchDate = true;
                const transactionDate = new Date(t.date);

                if (dateFilter === "today") {
                    matchDate = transactionDate.toDateString() === today.toDateString();
                } else if (dateFilter === "week") {
                    const firstDayOfWeek = new Date(today);
                    firstDayOfWeek.setDate(today.getDate() - today.getDay());
                    firstDayOfWeek.setHours(0, 0, 0, 0);

                    const lastDayOfWeek = new Date(firstDayOfWeek);
                    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
                    lastDayOfWeek.setHours(23, 59, 59, 999);

                    matchDate = transactionDate >= firstDayOfWeek && transactionDate <= lastDayOfWeek;
                } else if (dateFilter === "month") {
                    matchDate =
                        transactionDate.getMonth() === today.getMonth() &&
                        transactionDate.getFullYear() === today.getFullYear();
                }

                return matchSearch && matchFilter && matchDate;
            })
            .sort((a, b) => {
                if (sortType === "newest") return new Date(b.date) - new Date(a.date);
                if (sortType === "oldest") return new Date(a.date) - new Date(b.date);
                if (sortType === "high") return Number(b.amount || 0) - Number(a.amount || 0);
                if (sortType === "low") return Number(a.amount || 0) - Number(b.amount || 0);
                return 0;
            });
    };


    const filteredSortedTransactions = getFilteredSortedTransactions();

    // Group transactions AFTER sorting
    const sections = groupTransactionsByDate(
        filteredSortedTransactions,
        dateFilter === "allTransactions" // skip date grouping if all time
    );


    const resetAll = () => {
        setSearchQuery("");
        setSortType("newest");
        setFilterType("all");
        setDateFilter("all");
    };

    const getStyles = (type) => {
        switch (type) {
            case "income":
                return { bg: "bg-green-500/20", icon: "arrow-down", color: "#22c55e" };
            case "borrow":
                return { bg: "bg-orange-500/20", icon: "repeat", color: "#fb923c" };
            default:
                return { bg: "bg-red-500/20", icon: "arrow-up", color: "#dc2626" };
        }
    };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                navigation.navigate("Home");
                return true;
            }
        );
        return () => backHandler.remove();
    }, [navigation]);

    return (
        <SafeAreaView className="flex-1 bg-black">
            {/* HEADER */}
            <AppLoader visible={loading} />
            <View className="px-4 pt-2 flex-row items-center mb-3">
                <TouchableOpacity onPress={() => navigation.navigate("Home")} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-poppinsBold">All Transactions</Text>
            </View>

            {/* SEARCH / FILTER BUTTON */}
            <View className="px-4 mb-3">
                <View className="flex-row items-center bg-zinc-900/80 rounded-2xl p-2">

                    {/* SEARCH */}
                    <View className="flex-1 flex-row items-center bg-black/40 rounded-xl px-3 h-11">
                        <Ionicons name="search" size={18} color="#9ca3af" />
                        <TextInput
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search transactions"
                            placeholderTextColor="#6b7280"
                            className="flex-1 ml-2 text-white text-sm"
                        />
                    </View>

                    {/* SINGLE FILTER BUTTON */}
                    <TouchableOpacity
                        onPress={() => setSheetVisible(true)}
                        className="ml-2 h-11 w-11 rounded-xl bg-black/40 items-center justify-center"
                    >
                        <Ionicons name="filter" size={18} color="#d1d5db" />
                    </TouchableOpacity>

                    {/* RESET ALL */}
                    {(searchQuery || filterType !== "all" || sortType !== "newest" || dateFilter !== "all") && (
                        <TouchableOpacity
                            onPress={resetAll}
                            className="ml-2 h-11 px-3 rounded-xl bg-red-500/15 items-center justify-center"
                        >
                            <Ionicons name="refresh" size={16} color="#f87171" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* LIST */}
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
                renderSectionHeader={({ section: { title } }) => (
                    <Text className="text-gray-400 text-xs mt-4 mb-2 font-poppinsSemiBold">
                        {title}
                    </Text>
                )}
                renderItem={({ item }) => {
                    const style = getStyles(item.type);
                    // const remaining = item.amount - (item.paidAmount || 0);

                    return (
                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={() => {
                                setSelectedTransaction(item);
                                setModalVisible(true);
                            }}
                            className="bg-zinc-900 rounded-2xl px-4 py-3 mb-2"
                        >
                            <View className="flex-row items-center">

                                {/* ICON */}
                                <View className={`w-10 h-10 rounded-full items-center justify-center ${style.bg}`}>
                                    <Ionicons name={style.icon} size={17} color={
                                        item.type === "borrow"
                                            ? "#fb923c"
                                            : item.type === "income"
                                                ? "#22c55e"
                                                : "#f02e2e"
                                    } />
                                </View>

                                {/* CENTER TEXT */}
                                <View className="flex-1 ml-3 pr-2">
                                    <Text
                                        className="text-white font-poppinsMedium text-sm"
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                    >
                                        {item.title}
                                    </Text>

                                    <Text
                                        className="text-gray-400 text-xs mt-0.5"
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                    >
                                        {item.subtitle || "—"}
                                    </Text>
                                </View>

                                {/* RIGHT AMOUNT + PAID INFO */}
                                <View className="items-end min-w-[100px] justify-center">
                                    {/* MAIN AMOUNT */}
                                    <Text
                                        className={`font-poppinsBold text-base ${item.type === "borrow"
                                            ? "text-orange-400"
                                            : item.type === "income"
                                                ? "text-emerald-400"
                                                : "text-red-500"
                                            }`}
                                    >
                                        {currency} {formatNumber(item.amount)}
                                    </Text>

                                    {item.type === "borrow" && item.paidAmount > 0 ? (
                                        <View className="mt-1 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                                            <Text className="text-emerald-400 text-[8px] font-poppinsMedium">
                                                Paid {currency} {formatNumber(item.paidAmount)}
                                            </Text>
                                        </View>
                                    ) : (
                                        <Text className="text-gray-500 text-[10px] uppercase mt-1">
                                            {item.type}
                                        </Text>
                                    )}

                                </View>

                            </View>
                        </TouchableOpacity>
                    );
                }}
            />

            {/* DETAIL MODAL */}
            <TransactionDetailModal
                visible={modalVisible}
                transaction={selectedTransaction}
                onClose={() => setModalVisible(false)}
                currency={currency}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* SORT / FILTER / DATE MODAL */}
            <BottomSheetModal
                visible={sheetVisible}
                onClose={() => setSheetVisible(false)}
                sortType={sortType}
                filterType={filterType}
                dateFilter={dateFilter}
                setSortType={setSortType}
                setFilterType={setFilterType}
                setDateFilter={setDateFilter}
                onApply={() => setSheetVisible(false)}
                onReset={resetAll}
            />
        </SafeAreaView>
    );
}
