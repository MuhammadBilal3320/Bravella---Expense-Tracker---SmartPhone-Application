import React, { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DeleteMonthConfirmModal({ visible, onCancel, onConfirm, month }) {
    const [canConfirm, setCanConfirm] = useState(false);

    useEffect(() => {
        if (visible) {
            setCanConfirm(false);
            const timer = setTimeout(() => setCanConfirm(true), 2000); // 2 sec read
            return () => clearTimeout(timer);
        }
    }, [visible]);

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View className="flex-1 bg-black/70 justify-center items-center px-4">
                <View className="w-full bg-zinc-900 rounded-3xl p-6 border border-white/20 shadow-lg">

                    {/* ICON */}
                    <View className="items-center mb-3">
                        <Ionicons name="alert-circle-outline" size={48} color="#facc15" />
                    </View>

                    {/* TITLE */}
                    <Text className="text-white text-xl font-poppinsBold text-center mb-2">
                        Delete Closed Month
                    </Text>

                    {/* SUBTITLE */}
                    <Text className="text-zinc-400 text-sm text-center font-poppinsMedium mb-4">
                        You are about to delete
                    </Text>

                    {/* MONTH BADGE */}
                    <View className="bg-red-600/20 px-4 py-2 rounded-full mb-4 items-center justify-center">
                        <Text className="text-red-500 text-base font-poppinsSemiBold">
                            {month}
                        </Text>
                    </View>

                    {/* MESSAGE */}
                    <Text className="text-zinc-300 text-center text-sm font-poppinsRegular mb-6 leading-5">
                        This action is <Text className="font-poppinsBold text-red-500">permanent</Text> and cannot be undone. 
                        Make sure you have reviewed all transactions before proceeding.
                    </Text>

                    {/* ACTION BUTTONS */}
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={onCancel}
                            className="flex-1 bg-zinc-800 py-3 rounded-xl border border-zinc-700"
                        >
                            <Text className="text-zinc-300 text-center text-sm font-poppinsSemiBold">
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            disabled={!canConfirm}
                            onPress={onConfirm}
                            className={`flex-1 py-3 rounded-xl ${canConfirm ? "bg-red-500" : "bg-red-500/50"}`}
                        >
                            <Text className="text-black text-center text-sm font-poppinsBold">
                                Delete
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
}
