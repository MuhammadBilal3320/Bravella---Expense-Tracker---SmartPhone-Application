import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CurrencyView from './CurrencyScreen';
import ProfileSettings from './ProfileSettings';
import AboutScreen from './AboutScreen';
import DataCleanupResetScreen from './DataCleanupResetScreen';

const { width } = Dimensions.get('window');

export default function SettingsScreen() {
    const navigation = useNavigation();

    const [currency, setCurrency] = useState('Rs.');
    const [view, setView] = useState('main');

    const slideX = useRef(new Animated.Value(0)).current;

    // Load saved currency
    useEffect(() => {
        (async () => {
            const c = await AsyncStorage.getItem('currency');
            if (c) setCurrency(c);
        })();
    }, []);

    // Handle back press
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (view !== 'main') {
                closeView();
                return true;
            }
            navigation.navigate('Home');
            return true;
        });
        return () => backHandler.remove();
    }, [view]);

    // Open/Close animations
    const openView = () => {
        Animated.timing(slideX, {
            toValue: -width,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closeView = () => {
        Animated.timing(slideX, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setView('main'));
    };

    return (
        <SafeAreaView className="flex-1 overflow-hidden bg-black">
            <Animated.View
                style={{
                    flexDirection: 'row',
                    width: width * 2,
                    flex: 1,
                    transform: [{ translateX: slideX }],
                }}>
                {/* ========== MAIN SETTINGS ========== */}
                <View style={{ width }}>
                    {/* Header */}
                    <View className="flex-row items-center rounded-b-3xl px-5  py-4">
                        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <Text className="ml-4 text-xl font-bold text-white">Settings</Text>
                    </View>

                    {/* Settings Card */}
                    {/* ===== Settings Category ===== */}
                    <Text className="mx-5 mb-2 text-sm text-gray-400 font-poppinsMedium">App Settings</Text>

                    <View className="mx-5 overflow-hidden rounded-3xl" style={{ backgroundColor: '#1c1c1e' }}>
                        {/* ===== Profile ===== */}
                        <TouchableOpacity
                            onPress={() => {
                                setView('profile');
                                openView();
                            }}
                            className="flex-row items-center px-4 py-4">
                            <Ionicons name="person-outline" size={20} color="#d4d4d8" />
                            <Text className="ml-4 flex-1 text-base text-white font-poppinsMedium ">Profile</Text>
                            <Ionicons name="chevron-forward" size={18} color="#6b7280" />
                        </TouchableOpacity>
                        <View className="mx-4 h-px" style={{ backgroundColor: '#2c2c2e' }} />
                        {/* ===== Currency ===== */}
                        <TouchableOpacity
                            onPress={() => {
                                setView('currency');
                                openView();
                            }}
                            className="flex-row items-center px-4 py-4">
                            <Ionicons name="cash-outline" size={20} color="#d4d4d8" />
                            <Text className="ml-4 flex-1 text-base text-white font-poppinsMedium ">Currency</Text>
                            <Text className="mr-2 text-sm text-gray-400">{currency}</Text>
                            <Ionicons name="chevron-forward" size={18} color="#6b7280" />
                        </TouchableOpacity>
                        <View className="h-px mx-4" style={{ backgroundColor: "#2c2c2e" }} />

                        {/* ===== Reset Data ===== */}
                        <TouchableOpacity
                            onPress={() => {
                                setView("reset");
                                openView();
                            }}
                            className="flex-row items-center px-4 py-4"
                        >
                            <Ionicons name="trash-outline" size={20} color="#ef4444" />
                            <Text className="flex-1 ml-4 text-red-500 text-base font-poppinsMedium">
                                Data Cleanup & Reset
                            </Text>
                            <Ionicons name="chevron-forward" size={18} color="#6b7280" />
                        </TouchableOpacity>

                        {/* ===== About ===== */}
                        <TouchableOpacity
                            onPress={() => {
                                setView('about');
                                openView();
                            }}
                            className="flex-row items-center px-4 py-4">
                            <Ionicons name="information-circle-outline" size={20} color="#d4d4d8" />
                            <Text className="ml-4 flex-1 text-base text-white font-poppinsMedium">About</Text>
                            <Ionicons name="chevron-forward" size={18} color="#6b7280" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ========== SUB VIEW ========== */}
                {view === 'currency' && (
                    <CurrencyView
                        width={width}
                        selected={currency}
                        onBack={closeView}
                        onSelect={async (item) => {
                            await AsyncStorage.setItem('currency', item);
                            setCurrency(item);
                            closeView();
                        }}
                    />
                )}

                {view === "reset" && (
                    <DataCleanupResetScreen
                        width={width}
                        onBack={closeView}
                        navigation={navigation}
                    />
                )}


                {view === 'profile' && <ProfileSettings width={width} onBack={closeView} />}

                {view === 'about' && <AboutScreen width={width} onBack={closeView} />}
            </Animated.View>
        </SafeAreaView>
    );
}
