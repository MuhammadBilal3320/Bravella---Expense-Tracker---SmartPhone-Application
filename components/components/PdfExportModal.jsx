import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PdfExportModal({
    visible,
    onClose,
    onExportCurrentMonth,
    onExportAllClosedMonths,
}) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View className="flex-1 bg-black/70 items-center justify-center px-6">

                {/* Main Card */}
                <View className="w-full bg-zinc-900 rounded-[28px] p-6 border border-white/10">

                    {/* Header */}
                    <View className="items-center mb-6">
                        <View className="bg-white/10 p-4 rounded-full mb-3">
                            <Ionicons
                                name="document-text"
                                size={26}
                                color="white"
                            />
                        </View>
                        <Text className="text-white text-xl font-poppinsSemiBold">
                            Export Report
                        </Text>
                        <Text className="text-zinc-400 text-xs mt-1 font-poppinsRegular">
                            Choose how you want to export your data
                        </Text>
                    </View>

                    {/* Export Current Month */}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={onExportCurrentMonth}
                        className="flex-row items-center bg-zinc-800/80 border border-white/10 rounded-2xl p-4 mb-4"
                    >
                        <View className="bg-green-500/15 p-3 rounded-xl mr-4">
                            <Ionicons
                                name="calendar-outline"
                                size={20}
                                color="#22c55e"
                            />
                        </View>

                        <View className="flex-1">
                            <Text className="text-white font-poppinsMedium text-sm">
                                Current Month
                            </Text>
                            <Text className="text-zinc-400 text-[11px] font-poppinsRegular mt-0.5">
                                Export active month summary
                            </Text>
                        </View>

                        <Ionicons
                            name="chevron-forward"
                            size={18}
                            color="#71717a"
                        />
                    </TouchableOpacity>

                    {/* Export All Closed Months */}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={onExportAllClosedMonths}
                        className="flex-row items-center bg-zinc-800/80 border border-white/10 rounded-2xl p-4"
                    >
                        <View className="bg-indigo-500/15 p-3 rounded-xl mr-4">
                            <Ionicons
                                name="layers-outline"
                                size={20}
                                color="#6366f1"
                            />
                        </View>

                        <View className="flex-1">
                            <Text className="text-white font-poppinsMedium text-sm">
                                All Closed Months
                            </Text>
                            <Text className="text-zinc-400 text-[11px] font-poppinsRegular mt-0.5">
                                Grand total & history report
                            </Text>
                        </View>

                        <Ionicons
                            name="chevron-forward"
                            size={18}
                            color="#71717a"
                        />
                    </TouchableOpacity>

                    {/* Cancel */}
                    <TouchableOpacity
                        onPress={onClose}
                        activeOpacity={0.9}
                        className="mt-6 bg-zinc-800/80 border border-red-500/50 rounded-full py-3"
                    >
                        <Text className="text-zinc-300 text-center font-poppinsMedium text-sm">
                            Cancel
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
}
