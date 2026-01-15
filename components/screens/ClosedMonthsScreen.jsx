import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, BackHandler, Modal, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import SingleClosedMonthModal from "../components/SingleClosedMonthModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CloseMonthConfirmModal from "components/components/CloseMonthConfirmModal";
import PdfExportModal from "components/components/PdfExportModal";
import { allClosedMonthsTemplate, currentMonthTemplate, exportPdf } from "components/utils/pdfExport";
import AppLoader from "components/components/AppLoader";


export default function ClosedMonthsScreen() {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [closedMonths, setClosedMonths] = useState([]);
    const [closeMonthConfirmVisible, setCloseMonthConfirmVisible] = useState(false);
    const [currency, setCurrency] = useState("Rs.");
    const [pdfModalVisible, setPdfModalVisible] = useState(false);
    const [showAmountsModal, setShowAmountsModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showCloseSuccess, setShowCloseSuccess] = useState(false);



    const totalIncome = closedMonths.reduce((s, m) => s + m.income, 0);
    const totalExpense = closedMonths.reduce((s, m) => s + m.expense, 0);
    const totalBorrow = closedMonths.reduce((s, m) => s + m.borrow, 0);
    const totalBalance = totalIncome - totalExpense;

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


    useEffect(() => {
        loadClosedMonths();
    }, []);

    const loadClosedMonths = async () => {
        try {
            const storedMonths = await AsyncStorage.getItem("closedMonths");

            if (storedMonths) {
                setClosedMonths(JSON.parse(storedMonths));
            } else {
                setClosedMonths([]);
            }
        } catch (error) {
            console.log("Error loading closed months", error);
        }
    };

    const closeCurrentMonth = async () => {
        try {
            const storedTx = await AsyncStorage.getItem("transactions");
            const transactions = storedTx ? JSON.parse(storedTx) : [];

            // Only include fully paid borrows + all non-borrow transactions
            const transactionsForClosedMonth = transactions.filter(tx => {
                if (tx.type === "borrow") {
                    const paid = Number(tx.paidAmount || 0);
                    return paid >= tx.amount; // only fully repaid borrows
                }
                return true; // keep income & expense
            });

            //  Block closing if nothing is actually closable
            if (transactionsForClosedMonth.length === 0) {
                alert("No transactions available to close. Unpaid borrow entries cannot be closed.");
                return;
            }


            // Compute totals from filtered list
            const income = transactionsForClosedMonth
                .filter(t => t.type === "income")
                .reduce((sum, t) => sum + Number(t.amount), 0);

            const expense = transactionsForClosedMonth
                .filter(t => t.type === "expense" || (t.type === "borrow" && t.addExpense))
                .reduce((sum, t) => sum + Number(t.amount), 0);

            const borrow = transactionsForClosedMonth
                .filter(t => t.type === "borrow")
                .reduce((sum, t) => sum + Number(t.amount), 0);

            // Save closed month
            const closedMonth = {
                id: Date.now().toString(),
                month: new Date().toLocaleString("en-US", { month: "long", year: "numeric" }),
                income,
                expense,
                borrow,
                transactions: transactionsForClosedMonth,
                closedAt: new Date().toISOString(),
            };

            const storedMonths = await AsyncStorage.getItem("closedMonths");
            const months = storedMonths ? JSON.parse(storedMonths) : [];
            await AsyncStorage.setItem("closedMonths", JSON.stringify([closedMonth, ...months]));

            // Keep only partially paid borrows in Active transactions
            const remainingBorrow = transactions.filter(tx => {
                if (tx.type !== "borrow") return tx.type === "income" || tx.type === "expense" ? false : true; // keep only partially paid borrows
                const paid = Number(tx.paidAmount || 0);
                return paid < tx.amount; // partially paid
            });

            await AsyncStorage.setItem("transactions", JSON.stringify(remainingBorrow));

        } catch (error) {
            console.log("Close month error:", error);
        }
    };

    // Add this function inside ClosedMonthsScreen
    const deleteClosedMonth = async (monthId) => {
        try {
            // Filter out the deleted month
            const updatedMonths = closedMonths.filter(m => m.id !== monthId);

            // Save back to AsyncStorage
            await AsyncStorage.setItem("closedMonths", JSON.stringify(updatedMonths));

            // Update state
            setClosedMonths(updatedMonths);

            // Close modal if the deleted month was open
            if (selectedMonth?.id === monthId) {
                setModalVisible(false);
                setSelectedMonth(null);
            }

        } catch (error) {
            console.log("Delete closed month error:", error);
            alert("Failed to delete month.");
        }
    };

    const handleExportCurrentMonth = async () => {
        const storedTx = await AsyncStorage.getItem("transactions");
        const transactions = storedTx ? JSON.parse(storedTx) : [];

        const income = transactions
            .filter(t => t.type === "income")
            .reduce((s, t) => s + Number(t.amount), 0);

        const expense = transactions
            .filter(t => t.type === "expense")
            .reduce((s, t) => s + Number(t.amount), 0);

        const borrow = transactions
            .filter(t => t.type === "borrow")
            .reduce((s, t) => s + Number(t.amount), 0);

        const html = currentMonthTemplate({
            month: new Date().toLocaleString("en-US", { month: "long", year: "numeric" }),
            income,
            expense,
            borrow,
            balance: income - expense,
            currency,
            transactions
        });

        await exportPdf(html, "current-month-report.pdf");
    };

    const handleExportAllClosedMonths = async () => {
        const html = allClosedMonthsTemplate({
            months: closedMonths,
            currency,
        });

        await exportPdf(html, "closed-months-report.pdf");
    };




    const renderMonth = ({ item }) => {
        const balance = item.income - item.expense;



        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    setSelectedMonth(item);
                    setModalVisible(true);
                }}
                className="bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 mb-2.5"
            >

                {/* Header */}
                <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-white text-sm font-poppinsMedium">
                        {item.month}
                    </Text>

                    {/* Softer balance */}
                    <Text className="text-white text-sm font-poppinsSemiBold">
                        = {currency} {balance.toLocaleString()}
                    </Text>
                </View>

                {/* Stats */}
                <View className="flex-row justify-between">

                    <View className="flex-1 items-center">
                        <Text className="text-zinc-500 text-[9.5px] font-poppinsRegular">
                            Income
                        </Text>
                        <Text className="text-green-400 text-[11px] font-poppinsSemiBold">
                            {currency} {item.income.toLocaleString()}
                        </Text>
                    </View>

                    <View className="w-px bg-white/10 mx-1.5" />

                    <View className="flex-1 items-center">
                        <Text className="text-zinc-500 text-[9.5px] font-poppinsRegular">
                            Expense
                        </Text>
                        <Text className="text-red-500 text-[11px] font-poppinsSemiBold">
                            {currency} {item.expense.toLocaleString()}
                        </Text>
                    </View>

                    <View className="w-px bg-white/10 mx-1.5" />

                    <View className="flex-1 items-center">
                        <Text className="text-zinc-500 text-[9.5px] font-poppinsRegular">
                            Borrow
                        </Text>
                        <Text className="text-orange-400 text-[11px] font-poppinsSemiBold">
                            {currency} {item.borrow.toLocaleString()}
                        </Text>
                    </View>

                </View>
            </TouchableOpacity>

        );
    };

    return (
        <>
            <SafeAreaView className="flex-1 bg-black">
                {/* HEADER */}
                <View className="flex-row items-center justify-between px-4 py-3 border-b border-white/10">

                    {/* Left: Back + Title */}
                    <View className="flex-row items-center">
                        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                            <Ionicons name="arrow-back" size={22} color="white" />
                        </TouchableOpacity>

                        <Text
                            style={{ fontFamily: "Poppins_600SemiBold" }}
                            className="text-white text-lg ml-4"
                        >
                            Closed Months
                        </Text>
                    </View>

                    {/* Right: PDF Export */}
                    <TouchableOpacity onPress={() => setPdfModalVisible(true)}>
                        <Ionicons className="mr-4" name="document-text-outline" size={22} color="white" />
                    </TouchableOpacity>

                </View>

                {/* MAIN TOTAL CARD */}
                <View className="mx-4 mt-4 bg-zinc-900 rounded-3xl p-5 border border-zinc-700">

                    {/* HEADER */}
                    <View className="flex-row items-center justify-between mb-4">

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setShowAmountsModal(true)}
                            className="flex-1 pr-3"
                        >
                            <Text className="text-zinc-400 text-xs font-poppinsMedium">
                                Grand Total
                            </Text>

                            <Text
                                className="text-white text-3xl font-poppinsBold mt-1"
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {currency} {totalBalance.toLocaleString()}
                            </Text>
                        </TouchableOpacity>

                        <View className="border-2 border-red-600 p-1 rounded-full shrink-0">
                            <TouchableOpacity
                                disabled={showCloseSuccess}
                                onPress={() => setCloseMonthConfirmVisible(true)}
                                className={` h-10 w-28 rounded-full items-center justify-center bg-red-500`}
                            >
                                {showCloseSuccess ? (
                                    <Ionicons name="checkmark" size={25} color="black" />
                                ) : (
                                    <Text className="text-black font-poppinsBold text-sm">
                                        Close Month
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>

                    </View>

                    {/* DIVIDER */}
                    <View className="h-px bg-white/10 mb-4" />

                    {/* ONE ROW STATS */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setShowAmountsModal(true)}
                        className="flex-row justify-between"
                    >

                        {/* Income */}
                        <View className="flex-1 items-center">
                            <Text className="text-zinc-400 text-xs mb-1 font-poppinsMedium">
                                Income
                            </Text>
                            <Text
                                numberOfLines={1}
                                className="text-green-500 font-poppinsBold text-sm"
                            >
                                {currency} {totalIncome.toLocaleString()}
                            </Text>
                        </View>

                        <View className="w-px bg-white/10 mx-2" />

                        {/* Expense */}
                        <View className="flex-1 items-center">
                            <Text className="text-zinc-400 text-xs mb-1 font-poppinsMedium">
                                Expense
                            </Text>
                            <Text
                                numberOfLines={1}
                                className="text-red-500 font-poppinsBold text-sm"
                            >
                                {currency} {totalExpense.toLocaleString()}
                            </Text>
                        </View>

                        <View className="w-px bg-white/10 mx-2" />

                        {/* Borrow */}
                        <View className="flex-1 items-center">
                            <Text className="text-zinc-400 text-xs mb-1 font-poppinsMedium">
                                Borrow
                            </Text>
                            <Text
                                numberOfLines={1}
                                className="text-orange-400 font-poppinsBold text-sm"
                            >
                                {currency} {totalBorrow.toLocaleString()}
                            </Text>
                        </View>

                    </TouchableOpacity>
                </View>


                <Modal
                    transparent
                    animationType="fade"
                    visible={showAmountsModal}
                    onRequestClose={() => setShowAmountsModal(false)}
                >
                    <Pressable
                        className="flex-1 bg-black/70 items-center justify-center"
                        onPress={() => setShowAmountsModal(false)}
                    >
                        <Pressable
                            className="w-[90%] bg-zinc-900 rounded-3xl px-6 py-7 border border-white/10"
                            onPress={() => { }}
                        >
                            {/* Header */}
                            <View className="mb-6">
                                <Text className="text-zinc-400 text-xs font-poppinsMedium">
                                    Grand Total
                                </Text>

                                <Text className="text-white text-2xl font-poppinsBold mt-1">
                                    {currency} {totalBalance.toLocaleString()}
                                </Text>

                            </View>

                            {/* Stats */}
                            <View className="gap-3">
                                {/* Income */}
                                <View className="flex-row justify-between items-center bg-zinc-800/60 px-4 py-3 rounded-2xl">
                                    <Text className="text-zinc-400 text-sm">
                                        Income
                                    </Text>
                                    <Text className="text-green-500 font-poppinsBold text-sm">
                                        {currency} {totalIncome.toLocaleString()}
                                    </Text>
                                </View>

                                {/* Expense */}
                                <View className="flex-row justify-between items-center bg-zinc-800/60 px-4 py-3 rounded-2xl">
                                    <Text className="text-zinc-400 text-sm">
                                        Expense
                                    </Text>
                                    <Text className="text-red-500 font-poppinsBold text-sm">
                                        {currency} {totalExpense.toLocaleString()}
                                    </Text>
                                </View>

                                {/* Borrow */}
                                <View className="flex-row justify-between items-center bg-zinc-800/60 px-4 py-3 rounded-2xl">
                                    <Text className="text-zinc-400 text-sm">
                                        Borrow
                                    </Text>
                                    <Text className="text-orange-400 font-poppinsBold text-sm">
                                        {currency} {totalBorrow.toLocaleString()}
                                    </Text>
                                </View>
                            </View>

                            {/* Close hint (subtle) */}
                            <View className="items-center mt-6">
                                <View className="w-10 h-1 bg-zinc-600 rounded-full" />
                            </View>

                        </Pressable>
                    </Pressable>
                </Modal>



                {/* LIST HEADING */}
                <Text style={{ fontFamily: "Poppins_600SemiBold" }} className="text-gray-400 text-sm mt-6 mb-2 px-4">Closed Month History</Text>

                {/* CLOSED MONTH LIST */}
                <FlatList
                    data={closedMonths}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMonth}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                />


                {/* MODAL */}
                <SingleClosedMonthModal
                    visible={modalVisible}
                    data={selectedMonth}
                    onClose={() => setModalVisible(false)}
                    onDeleteMonth={deleteClosedMonth}
                />

                <CloseMonthConfirmModal
                    visible={closeMonthConfirmVisible}
                    onCancel={() => setCloseMonthConfirmVisible(false)}
                    onConfirm={async () => {
                        setCloseMonthConfirmVisible(false);

                        await closeCurrentMonth();
                        loadClosedMonths();

                        // ✅ show tick
                        setShowCloseSuccess(true);

                        // ⏱ hide tick after 2 seconds
                        setTimeout(() => {
                            setShowCloseSuccess(false);
                        }, 2000);
                    }}
                />

                <PdfExportModal
                    visible={pdfModalVisible}
                    onClose={() => setPdfModalVisible(false)}
                    onExportCurrentMonth={handleExportCurrentMonth}
                    onExportAllClosedMonths={handleExportAllClosedMonths}
                />
            </SafeAreaView>
        </>
    );
}
