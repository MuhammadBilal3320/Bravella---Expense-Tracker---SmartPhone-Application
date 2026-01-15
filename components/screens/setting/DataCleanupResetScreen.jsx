import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";


const { width: screenWidth } = Dimensions.get("window");

export default function DataCleanupResetScreen({ width, onBack }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const scaleAnim = useRef(new Animated.Value(0)).current;

  const holdProgress = useRef(new Animated.Value(0)).current;
  const [holding, setHolding] = useState(false);

  const progressWidth = holdProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const startHold = () => {
    setHolding(true);
    holdProgress.setValue(0);

    Animated.timing(holdProgress, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        handleLongPressDelete();
      }
    });
  };

  const cancelHold = () => {
    setHolding(false);
    Animated.timing(holdProgress, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };


  // Open modal with animation
  const openModal = (option) => {
    setSelectedOption(option);
    setModalVisible(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // Close modal with animation
  const closeModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedOption(null);
    });
  };

  const resetCurrentMonth = async () => {
    try {
      await AsyncStorage.multiRemove([
        "transactions",      // current month transactions
        "currentMonthTotal", // optional totals
      ]);
    } catch (e) {
      console.error("Reset current month failed", e);
    }
  };

  const deleteClosedMonths = async () => {
    try {
      await AsyncStorage.removeItem("closedMonths");
    } catch (e) {
      console.error("Delete closed months failed", e);
    }
  };

  const resetEntireApp = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();

      // Keep only absolutely required keys (optional)
      const protectedKeys = []; // or ["currency"]

      const keysToDelete = keys.filter(
        (key) => !protectedKeys.includes(key)
      );

      await AsyncStorage.multiRemove(keysToDelete);

      // Small delay for safety (UX polish)
      setTimeout(async () => {
        await Updates.reloadAsync(); // 🔥 FULL APP RESTART
      }, 400);

    } catch (e) {
      console.error("Full reset failed", e);
    }
  };



  // Long press placeholder
  const handleLongPressDelete = async () => {
    switch (selectedOption) {
      case "current":
        await resetCurrentMonth();
        closeModal();
        break;

      case "closed":
        await deleteClosedMonths();
        closeModal();
        break;

      case "all":
        closeModal();
        await resetEntireApp(); // app reloads
        return;
    }

    setHolding(false);
    holdProgress.setValue(0);
  };



  const renderModalContent = () => {
    if (!selectedOption) return null;

    let title = "";
    let description = "";
    let icon = "";
    let color = "";

    switch (selectedOption) {
      case "current":
        title = "Reset Current Month";
        description =
          "This will delete all transactions and data of the current month. This action cannot be undone.";
        icon = "refresh-outline";
        color = "#facc15";
        break;
      case "closed":
        title = "Delete All Closed Months";
        description =
          "This will permanently delete all closed months. Current month data will remain intact.";
        icon = "trash-outline";
        color = "#ef4444";
        break;
      case "all":
        title = "Reset Entire App Data";
        description =
          "This will permanently delete ALL data including current month and closed months. This action cannot be undone.";
        icon = "warning-outline";
        color = "#ef4444";
        break;
    }

    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          width: screenWidth - 56,
        }}
        className="rounded-[28px] bg-zinc-900 p-6 border border-white/10"
      >
        {/* ===== Icon Badge ===== */}
        <View className="items-center mb-5">
          <View
            style={{ backgroundColor: `${color}22` }}
            className="h-16 w-16 rounded-full items-center justify-center"
          >
            <Ionicons name={icon} size={30} color={color} />
          </View>
        </View>

        {/* ===== Title ===== */}
        <Text className="text-white text-xl font-poppinsSemiBold text-center mb-2">
          {title}
        </Text>

        {/* ===== Description ===== */}
        <Text className="text-gray-400 text-xs text-center leading-5 mb-6 font-poppins">
          {description}
        </Text>

        {/* ===== Cancel Button ===== */}
        <TouchableOpacity
          onPress={closeModal}
          activeOpacity={0.85}
          className="h-12 rounded-2xl bg-zinc-800 items-center justify-center mb-3"
        >
          <Text className="text-white font-poppinsMedium">
            Cancel
          </Text>
        </TouchableOpacity>

        {/* ===== Hold to Delete ===== */}
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={startHold}
          onPressOut={cancelHold}
          className="h-12 rounded-2xl overflow-hidden bg-zinc-800 border border-red-500"
        >

          <Animated.View
            style={{ width: progressWidth }}
            className="absolute inset-y-0 left-0 bg-red-600"
          />

          {/* 🧠 Button Text */}
          <View className="flex-1 items-center justify-center">
            <Text className="text-white font-poppinsBold">
              {holding ? "Keep holding…" : "Hold 2 seconds to confirm"}
            </Text>
          </View>
        </TouchableOpacity>


        {/* ===== Hint ===== */}
        <Text className="mt-3 text-center text-[11px] text-gray-500 font-poppins">
          This action cannot be undone
        </Text>
      </Animated.View>

    );
  };

  return (
    <View style={{ width }} className="flex-1 bg-black">
      {/* ===== Header ===== */}
      <View className="flex-row items-center px-6 pt-6 pb-4">
        <TouchableOpacity
          onPress={onBack}
          className="h-10 w-10 items-center justify-center rounded-full bg-white/5"
        >
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>

        <View className="ml-4">
          <Text className="text-xl font-poppinsSemiBold text-white">
            Data Cleanup & Reset
          </Text>
          <Text className="text-xs font-poppins text-gray-400">
            Reset & manage stored data
          </Text>
        </View>
      </View>

      {/* ===== Safe Options ===== */}
      <Text className="mx-6 mt-6 mb-3 text-xs uppercase tracking-wider text-gray-500">
        Safe Options
      </Text>

      <View className="mx-6 rounded-3xl bg-zinc-900 overflow-hidden border border-white/5">
        {/* Reset Current Month */}
        <TouchableOpacity
          onPress={() => openModal("current")}
          className="flex-row items-center px-5 py-5"
        >
          <View className="h-10 w-10 rounded-full bg-yellow-500/15 items-center justify-center">
            <Ionicons name="refresh-outline" size={20} color="#facc15" />
          </View>

          <View className="ml-4 flex-1">
            <Text className="font-poppinsMedium text-base text-white">
              Reset Current Month
            </Text>
            <Text className="font-poppins text-xs text-gray-400 mt-0.5">
              Clears only active month data
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={18} color="#6b7280" />
        </TouchableOpacity>

        <View className="h-px bg-white/5 mx-5" />

        {/* Delete Closed Months */}
        <TouchableOpacity
          onPress={() => openModal("closed")}
          className="flex-row items-center px-5 py-5"
        >
          <View className="h-10 w-10 rounded-full bg-red-500/15 items-center justify-center">
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </View>

          <View className="ml-4 flex-1">
            <Text className="font-poppinsMedium text-base text-white">
              Delete Closed Months
            </Text>
            <Text className="font-poppins text-xs text-gray-400 mt-0.5">
              Permanently removes archived data
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={18} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* ===== Danger Zone ===== */}
      <Text className="mx-6 mt-8 mb-3 text-xs uppercase tracking-wider text-red-400">
        Danger Zone
      </Text>

      <View className="mx-6 rounded-3xl bg-zinc-900 border border-red-500/30 overflow-hidden">
        <TouchableOpacity
          onPress={() => openModal("all")}
          className="flex-row items-center px-5 py-5"
        >
          <View className="h-10 w-10 rounded-full bg-red-500/20 items-center justify-center">
            <Ionicons name="warning-outline" size={20} color="#ef4444" />
          </View>

          <View className="ml-4 flex-1">
            <Text className="font-poppinsSemiBold text-base text-red-500">
              Reset Entire App Data
            </Text>
            <Text className="font-poppins text-xs text-gray-400 mt-0.5">
              This action cannot be undone
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>

      {/* ===== Modal Overlay ===== */}
      {modalVisible && (
        <View className="absolute inset-0 bg-black/70 items-center justify-center px-5">
          {renderModalContent()}
        </View>
      )}
    </View>

  );
}
