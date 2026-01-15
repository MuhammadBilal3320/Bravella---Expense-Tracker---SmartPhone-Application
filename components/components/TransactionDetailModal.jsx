import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const formatNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? "0" : num.toLocaleString();
};


export default function TransactionDetailModal({
    visible,
    onClose,
    transaction,
    onEdit,
    onDelete,
    currency
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [formErrors, setFormErrors] = useState([]);

    const [form, setForm] = useState({
        title: "",
        subtitle: "",
        amount: "",
        repayAmount: "",
        date: "",
        type: "expense",
    });

    const updateForm = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (formErrors.length) setFormErrors([]);
    };



    /* ================= EFFECT ================= */
    useEffect(() => {
        if (transaction) {
            setForm({
                title: transaction.title,
                subtitle: transaction.subtitle || "",
                amount: String(Math.abs(transaction.amount)),
                repayAmount: "",
                date: new Date(transaction.date).toISOString(),
                type: transaction.type,
            });

            setIsEditing(false);
            setShowDeleteConfirm(false);
        }
    }, [transaction]);

    useEffect(() => {
        if (transaction) {
            setFormErrors([]);
        }
    }, [transaction]);



    if (!transaction) return null;

    /* ================= DERIVED VALUES ================= */
    const paid = Number(transaction.paidAmount || 0);
    const amount = Number(transaction.amount || 0);
    const remaining = Math.max(amount - paid, 0);
    const isBorrowOpen =
        transaction.type === "borrow" && remaining > 0 && !isEditing;

    /* ================= REPAY VALIDATION ================= */
    const repayValue = Number(form.repayAmount);

    const repayTooMuch =
        repayValue > remaining;

    const repayInvalid =
        !repayValue || repayValue <= 0;

    const canRepay =
        !repayInvalid && !repayTooMuch;


    /* ================= CONFIG ================= */
    const getConfig = (type) => {
        switch (type) {
            case "income":
                return { color: "#22c55e", label: "Income", icon: "arrow-down" };
            case "borrow":
                return { color: "#fb923c", label: "Borrow", icon: "repeat" };
            default:
                return { color: "#ef4444", label: "Expense", icon: "arrow-up" };
        }
    };

    const cfg = getConfig(transaction.type);
    const dateObj = new Date(transaction.date);

    const titleInvalid = !form.title.trim();

    const rawAmount = Number(form.amount);
    const amountInvalid = isNaN(rawAmount) || rawAmount <= 0;

    const validateForm = () => {
        const errors = [];

        if (!form.title.trim()) {
            errors.push("Title is required");
        }

        const amount = Number(form.amount);
        if (isNaN(amount) || amount <= 0) {
            errors.push("Enter a valid amount");
        }

        if (!form.date) {
            errors.push("Date & time is required");
        }

        setFormErrors(errors);
        return errors.length === 0;
    };




    /* ================= SAVE EDIT ================= */
    const handleSave = () => {
        if (!validateForm()) return;

        const finalAmount = Math.abs(Number(form.amount));

        onEdit?.({
            ...transaction,
            title: form.title.trim(),
            subtitle: form.subtitle?.trim() || "",
            type: form.type,
            amount: finalAmount,
            paidAmount: form.type === "borrow" ? paid : 0,
            date: new Date(form.date).toISOString(),
        });

        setIsEditing(false);
        onClose();
    };


    /* ================= REPAY ================= */
    const handleRepay = () => {
        if (!canRepay) return;

        onEdit?.({
            ...transaction,
            paidAmount: paid + repayValue,
        });

        setForm({ ...form, repayAmount: "" });
        onClose();
    };


    /* ================= UI ================= */
    return (
        <SafeAreaView className="flex-1">
            <Modal
                visible={visible}
                transparent
                animationType="slide"
                onRequestClose={onClose}
            >
                <SafeAreaView className="flex-1">
                    <View className="flex-1 bg-black/50 justify-end">
                        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />

                        <View className="bg-zinc-900 rounded-t-3xl p-5 w-full">

                            {/* Header */}
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-white text-lg font-poppinsBold">
                                    {isEditing ? "Edit Transaction" : "Transaction Details"}
                                </Text>
                                <TouchableOpacity onPress={onClose}>
                                    <Ionicons name="close" size={24} color="white" />
                                </TouchableOpacity>
                            </View>

                            {/* Summary Card */}
                            {!isEditing && (
                                <View className="flex-row bg-zinc-800 rounded-2xl p-3 mb-4 items-center justify-between">
                                    <View>
                                        <Text className="text-gray-400 text-xs">{cfg.label}</Text>
                                        <Text className="font-poppinsBold text-2xl" style={{ color: cfg.color }}>
                                            {currency} {formatNumber(Math.abs(amount))}
                                        </Text>

                                        {/* Paid / Remaining */}
                                        {transaction.type === "borrow" && (
                                            <View className="flex-row gap-3 mt-1">
                                                <View className="px-2 py-1 rounded-xl bg-green-600/20">
                                                    <Text className="text-green-500 text-xs font-poppinsBold">
                                                        Paid: {currency} {formatNumber(paid)}
                                                    </Text>
                                                </View>
                                                <View className="px-2 py-1 rounded-xl bg-red-600/20">
                                                    <Text className="text-red-500 text-xs font-poppinsBold">
                                                        Remaining: {currency} {formatNumber(remaining)}
                                                    </Text>
                                                </View>
                                            </View>
                                        )}
                                    </View>

                                    <View
                                        className="w-16 h-16 rounded-full items-center justify-center"
                                        style={{ backgroundColor: `${cfg.color}22` }}
                                    >
                                        <Ionicons name={cfg.icon} size={26} color={cfg.color} />
                                    </View>
                                </View>
                            )}

                            {/* Details / Edit Grid */}
                            <View className="bg-zinc-800 rounded-2xl p-4 mb-4 space-y-2">

                                {isEditing && (
                                    <View className="mb-3">
                                        <Text className="text-zinc-400 text-xs mb-2 font-poppinsMedium">
                                            Transaction Type
                                        </Text>

                                        <View className="flex-row bg-zinc-900 p-1 rounded-2xl border border-white/10">
                                            {["expense", "income", "borrow"].map((t) => {
                                                const active = form.type === t;
                                                const cfg = getConfig(t);

                                                return (
                                                    <TouchableOpacity
                                                        key={t}
                                                        activeOpacity={0.85}
                                                        onPress={() =>
                                                            setForm((prev) => ({ ...prev, type: t }))
                                                        }
                                                        className={`flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2
                        ${active ? "bg-zinc-800" : ""}
                    `}
                                                    >
                                                        {/* ICON */}
                                                        <Ionicons
                                                            name={cfg.icon}
                                                            size={16}
                                                            color={active ? cfg.color : "#6b7280"}
                                                        />

                                                        {/* LABEL */}
                                                        <Text
                                                            className={`font-poppinsBold text-sm`}
                                                            style={{ color: active ? cfg.color : "#6b7280" }}
                                                        >
                                                            {cfg.label}
                                                        </Text>

                                                        {/* ACTIVE DOT */}
                                                        {active && (
                                                            <View
                                                                style={{
                                                                    position: "absolute",
                                                                    bottom: 4,
                                                                    width: 20,
                                                                    height: 4,
                                                                    borderRadius: 999,
                                                                    backgroundColor: cfg.color,
                                                                }}
                                                            />
                                                        )}
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    </View>


                                )}

                                {[
                                    {
                                        label: "Title", value: isEditing ? <Input
                                            value={form.title}
                                            onChangeText={(t) => updateForm("title", t)}
                                        />
                                            : <TextValue value={transaction.title} />
                                    },
                                    {
                                        label: "Description", value: isEditing ? <Input
                                            value={form.subtitle}
                                            onChangeText={(t) => updateForm("subtitle", t)}
                                            placeholder="Optional"
                                        />
                                            : <TextValue value={transaction.subtitle || "—"} />
                                    },
                                    {
                                        label: "Amount", value: isEditing ? <Input
                                            keyboardType="numeric"
                                            value={form.amount}
                                            onChangeText={(t) => updateForm("amount", t)}
                                        />
                                            : <TextValue value={`${currency} ${Math.abs(transaction.amount).toLocaleString()}`} />
                                    },
                                    {
                                        label: "Date & Time", value: (
                                            <>
                                                <TextValue value={dateObj ? dateObj.toLocaleString() : "—"} />

                                                {isEditing && formErrors.length > 0 && (
                                                    <View className="mt-2 space-y-1">
                                                        {formErrors.map((err, idx) => (
                                                            <Text
                                                                key={idx}
                                                                className="text-red-400 text-[11px] font-poppinsMedium"
                                                            >
                                                                • {err}
                                                            </Text>
                                                        ))}
                                                    </View>
                                                )}
                                            </>
                                        )
                                    },
                                ].map((item, idx) => (
                                    <View key={idx} className="flex-row justify-between items-center py-1 border-b border-white/10">
                                        <Text className="text-gray-400 text-sm w-28">{item.label}</Text>
                                        <View className="flex-1 ml-2">{item.value}</View>
                                    </View>
                                ))}
                            </View>

                            {/* Borrow Repay */}
                            {isBorrowOpen && (
                                <View className="bg-zinc-900 rounded-2xl p-4 mb-4 border border-emerald-400/50">

                                    {/* Top row */}
                                    <View className="flex-row justify-between mb-3">
                                        <Text className="text-gray-400 text-xs font-poppinsMedium">
                                            Borrow Repayment
                                        </Text>
                                        <Text className="text-red-400 text-xs font-poppinsBold">
                                            Remaining {currency} {remaining.toLocaleString()}
                                        </Text>
                                    </View>


                                    {/* Input + Button */}
                                    <View className="flex-row items-center gap-3">
                                        <TextInput
                                            keyboardType="numeric"
                                            value={form.repayAmount}
                                            onChangeText={(t) => setForm({ ...form, repayAmount: t })}
                                            placeholder="Enter amount"
                                            placeholderTextColor="#71717a"
                                            style={{ fontFamily: "sans-serif-medium", fontWeight: "bold", fontSize: 12 }}
                                            className={`flex-1 rounded-xl px-4 py-3 text-white
                    ${repayTooMuch ? "bg-red-900/30 border border-red-500/40" : "bg-zinc-800"}
                `}
                                        />

                                        <TouchableOpacity
                                            disabled={!canRepay}
                                            onPress={handleRepay}
                                            className={`rounded-xl px-5 py-3
                    ${canRepay ? "bg-emerald-500" : "bg-emerald-500/30"}
                `}
                                        >
                                            <Text className="text-white font-poppinsBold text-sm">
                                                Repay
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Inline error */}
                                    {repayTooMuch && (
                                        <Text className="text-red-400 text-xs mt-2 font-poppinsMedium">
                                            Repay amount cannot exceed remaining balance
                                        </Text>
                                    )}

                                </View>
                            )}


                            {/* Actions */}
                            <View className="flex-row justify-between gap-2">
                                {isEditing ? (
                                    <>
                                        <ActionButton label="Cancel" icon="close" type="ghost" onPress={() => setIsEditing(false)} fullWidth />
                                        <ActionButton label="Save" icon="checkmark" type="primary" onPress={handleSave} fullWidth />
                                    </>
                                ) : (
                                    <>
                                        <ActionButton label="Edit" icon="pencil" type="secondary" onPress={() => setIsEditing(true)} fullWidth />
                                        <ActionButton label="Delete" icon="trash" type="danger" onPress={() => setShowDeleteConfirm(true)} fullWidth />
                                    </>
                                )}
                            </View>
                        </View>

                        {/* 🔥 Delete Confirmation Modal */}
                        <Modal visible={showDeleteConfirm} transparent animationType="fade">
                            <View className="flex-1 bg-black/70 items-center justify-center px-6">
                                <View className="w-full bg-zinc-900 rounded-3xl p-6 border border-white/10 shadow-lg">

                                    {/* Icon */}
                                    <View className="self-center mb-4 bg-red-500/20 p-4 rounded-full">
                                        <Ionicons name="trash-outline" size={32} color="#ef4444" />
                                    </View>

                                    {/* Title */}
                                    <Text className="text-white text-center font-poppinsBold text-lg mb-1">
                                        Delete Transaction?
                                    </Text>

                                    {/* Subtitle */}
                                    <Text className="text-zinc-400 text-center text-sm mb-4 leading-5">
                                        This action is <Text className="text-red-500 font-poppinsSemiBold">permanent</Text> and cannot be undone.
                                    </Text>

                                    {/* Action Buttons */}
                                    <View className="flex-row mt-4 gap-3">
                                        <TouchableOpacity
                                            onPress={() => setShowDeleteConfirm(false)}
                                            className="flex-1 py-3 rounded-xl border border-white/10 items-center bg-zinc-800"
                                        >
                                            <Text className="text-zinc-300 font-poppinsMedium">
                                                Cancel
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => {
                                                onDelete?.(transaction);
                                                setShowDeleteConfirm(false);
                                                onClose?.();
                                            }}
                                            className="flex-1 py-3 rounded-xl bg-red-500/90 items-center shadow-md"
                                        >
                                            <Text className="text-white font-poppinsBold">
                                                Delete
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </View>

                        </Modal>
                    </View>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

/* ================= REUSABLE ================= */
function DetailRow({ label, children }) {
    return (
        <View>
            <Text className="text-gray-400 text-xs mb-1">{label}</Text>
            {children}
        </View>
    );
}

function TextValue({ value }) {
    return <Text className="text-white font-poppinsMedium">{value}</Text>;
}

function Input(props) {
    return (
        <TextInput
            {...props}
            className="bg-zinc-900 rounded-xl px-3 py-2 text-white font-poppinsMedium"
            placeholderTextColor="#71717a"
        />
    );
}

function ActionButton({ label, icon, onPress, type }) {
    const styles = {
        primary: "bg-emerald-500",
        secondary: "bg-zinc-700",
        danger: "border border-red-500",
        ghost: "bg-zinc-700",
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            className={`flex-1 py-4 rounded-2xl flex-row items-center justify-center gap-2 ${styles[type]}`}
        >
            <Ionicons
                name={icon}
                size={18}
                color={type === "danger" ? "#ef4444" : "white"}
            />
            <Text
                className={`font-poppinsBold ${type === "danger" ? "text-red-500" : "text-white"
                    }`}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}

function Divider() {
    return <View className="h-px bg-zinc-700 my-3" />;
}
