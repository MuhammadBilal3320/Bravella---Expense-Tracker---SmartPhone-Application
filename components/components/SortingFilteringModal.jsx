import React from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SortingFilteringModal({
    visible,
    onClose,
    sortType,
    filterType,
    dateFilter,
    setSortType,
    setFilterType,
    setDateFilter,
    onApply,
    onReset,
}) {
    const sortOptions = [
        { label: "Newest First", value: "newest" },
        { label: "Oldest First", value: "oldest" },
        { label: "Price High-> Low", value: "high" },
        { label: "Price Low-> High", value: "low" },
    ];

    const filterOptions = [
        { label: "All", value: "all" },
        { label: "Income", value: "income" },
        { label: "Expense", value: "expense" },
        { label: "Borrow", value: "borrow" },
    ];

    const dateOptions = [
        { label: "All Time", value: "all" },
        { label: "Today", value: "today" },
        { label: "This Week", value: "week" },
        { label: "This Month", value: "month" },
    ];

    const OptionCard = ({ item, selected, onPress, fullWidth = false }) => (
        <TouchableOpacity
            onPress={() => onPress(item.value)}
            className={`rounded-xl px-4 py-3 mb-3 bg-zinc-800/50 ${selected === item.value ? "bg-emerald-500/20" : ""
                }`}
            style={{
                flex: fullWidth ? 0 : 1,
                width: fullWidth ? "100%" : undefined,
                minWidth: fullWidth ? "100%" : 120,
                maxWidth: fullWidth ? "100%" : 160,
                marginHorizontal: fullWidth ? 0 : 5,
            }}
        >
            <Text
                className={`text-sm font-poppinsMedium text-center ${selected === item.value ? "text-emerald-400" : "text-gray-300"
                    }`}
                numberOfLines={1}
            >
                {item.label}
            </Text>
        </TouchableOpacity>
    );

    const OptionGrid = ({ options, selected, onPress }) => (
        <View className="flex-row flex-wrap justify-start">
            {options.map((item) => (
                <OptionCard
                    key={item.value}
                    item={item}
                    selected={selected}
                    onPress={onPress}
                />
            ))}
        </View>
    );

    return (
        <SafeAreaView className="flex-1">
            <Modal visible={visible} transparent animationType="slide">
                <SafeAreaView className="flex-1">
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={onClose}
                        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
                    >
                        <View
                            style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                backgroundColor: "#1c1c1e",
                                borderTopLeftRadius: 30,
                                borderTopRightRadius: 30,
                                padding: 20,
                                maxHeight: "85%",
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: -5 },
                                shadowOpacity: 0.5,
                                shadowRadius: 10,
                                elevation: 10,
                            }}
                        >
                            {/* Drag Handle */}
                            <View className="w-12 h-1.5 bg-zinc-700 rounded-full self-center mb-5" />

                            <ScrollView showsVerticalScrollIndicator={false}>
                                {/* SORT */}
                                <Text className="text-white text-base font-poppinsSemiBold mb-2">
                                    Sort By
                                </Text>
                                <OptionGrid
                                    options={sortOptions}
                                    selected={sortType}
                                    onPress={setSortType}
                                />

                                {/* FILTER */}
                                <Text className="text-white text-base font-poppinsSemiBold mt-3 mb-2">
                                    Filter By Type
                                </Text>
                                <OptionGrid
                                    options={filterOptions}
                                    selected={filterType}
                                    onPress={setFilterType}
                                />

                                {/* DATE RANGE */}
                                <Text className="text-white text-base font-poppinsSemiBold mt-3 mb-2">
                                    Date Range
                                </Text>
                                <OptionGrid
                                    options={dateOptions}
                                    selected={dateFilter}
                                    onPress={setDateFilter}
                                />

                                {/* FULL WIDTH ALL TRANSACTIONS BUTTON */}
                                <OptionCard
                                    item={{ label: "All Transactions", value: "allTransactions" }}
                                    selected={dateFilter}
                                    onPress={setDateFilter}
                                    fullWidth
                                />
                            </ScrollView>

                            {/* ACTIONS */}
                            <View className="flex-row flex-wrap mt-5 justify-start">
                                <TouchableOpacity
                                    onPress={onReset}
                                    className="py-3 bg-red-500/20 rounded-xl mb-3 mr-3 items-center"
                                    style={{ flex: 1, minWidth: 120, maxWidth: 160 }}
                                >
                                    <Text className="text-red-400 font-poppinsMedium text-sm">
                                        Reset
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={onApply}
                                    className="py-3 bg-emerald-500/20 rounded-xl mb-3 mr-3 items-center"
                                    style={{ flex: 1, minWidth: 120, maxWidth: 160 }}
                                >
                                    <Text className="text-emerald-400 font-poppinsMedium text-sm">
                                        Apply
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}
