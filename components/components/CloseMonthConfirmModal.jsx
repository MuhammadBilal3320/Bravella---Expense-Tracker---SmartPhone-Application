import React, { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CloseMonthConfirmModal({
    visible,
    onCancel,
    onConfirm,
}) {
    const [canConfirm, setCanConfirm] = useState(false);

    useEffect(() => {
        if (visible) {
            setCanConfirm(false);
            const timer = setTimeout(() => {
                setCanConfirm(true);
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    const InfoRow = ({ icon, text }) => (
        <View className="flex-row items-start gap-3">
            <Ionicons name={icon} size={18} color="#a1a1aa" style={{ marginTop: 2 }} />
            <Text
                style={{ fontFamily: "Poppins_400Regular" }}
                className="text-zinc-300 text-sm flex-1 leading-5"
            >
                {text}
            </Text>
        </View>
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View className="flex-1 bg-black/70 justify-center px-4">
                <View className="bg-zinc-900 rounded-3xl p-6 border border-white/10">

                    {/* HEADER */}
                    <View className="items-center mb-5">
                        <View className="w-14 h-14 rounded-full bg-yellow-400/10 items-center justify-center mb-3">
                            <Ionicons name="alert-circle" size={32} color="#facc15" />
                        </View>

                        <Text
                            style={{ fontFamily: "Poppins_700Bold" }}
                            className="text-white text-lg text-center"
                        >
                            Before You Close the Month
                        </Text>

                        <Text
                            style={{ fontFamily: "Poppins_400Regular" }}
                            className="text-zinc-400 text-xs text-center mt-1"
                        >
                            Please read this once
                        </Text>
                    </View>

                    {/* INFO BOX */}
                    <View className="bg-zinc-800/60 rounded-2xl p-4 mb-5 space-y-3">
                        <InfoRow
                            icon="wallet-outline"
                            text="Some borrowed money is not fully paid."
                        />
                        <InfoRow
                            icon="eye-outline"
                            text="That borrow will stay visible so you don’t forget it."
                        />
                        <InfoRow
                            icon="trending-down-outline"
                            text="Borrow is counted like an expense."
                        />
                        <InfoRow
                            icon="remove-circle-outline"
                            text="Because of this, balance may look Negative."
                        />

                        <View className="pt-2">
                            <Text
                                style={{ fontFamily: "Poppins_500Medium" }}
                                className="text-green-400 text-sm"
                            >
                                This is normal. Nothing is wrong.
                            </Text>
                        </View>
                    </View>

                    {/* ACTIONS */}
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={onCancel}
                            className="flex-1 bg-zinc-800 py-3 rounded-xl"
                        >
                            <Text
                                style={{ fontFamily: "Poppins_600SemiBold" }}
                                className="text-zinc-300 text-center text-sm"
                            >
                                Go Back
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            disabled={!canConfirm}
                            onPress={onConfirm}
                            className={`flex-1 py-3 rounded-xl ${
                                canConfirm ? "bg-red-500" : "bg-red-500/40"
                            }`}
                        >
                            <Text
                                style={{ fontFamily: "Poppins_700Bold" }}
                                className="text-black text-center text-sm"
                            >
                                Yes, Close Month
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
}
