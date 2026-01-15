import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, Animated, Easing } from "react-native";

export default function AppLoader({ visible = true }) {
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const [dots, setDots] = useState("");
    const [showLoader, setShowLoader] = useState(visible);

    // Spinner rotation
    useEffect(() => {
        if (!showLoader) return;

        const spin = Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );

        spin.start();

        return () => spin.stop();
    }, [showLoader]);

    // Animated dots
    useEffect(() => {
        if (!showLoader) return;

        const interval = setInterval(() => {
            setDots((prev) => (prev.length === 3 ? "" : prev + "."));
        }, 500);

        return () => clearInterval(interval);
    }, [showLoader]);

    // Ensure loader shows at least 1 second
    useEffect(() => {
        let timeout;
        if (visible) {
            setShowLoader(true);
        } else {
            timeout = setTimeout(() => setShowLoader(false), 120); // minimum 1 second
        }
        return () => clearTimeout(timeout);
    }, [visible]);

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    if (!showLoader) return null;

    return (
        <View
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.712)",
                zIndex: 9999,
            }}
        >
            {/* Loader Card */}
            <View
                style={{
                    width: "90%",
                    maxWidth: 520,
                    backgroundColor: "#161616",
                    borderRadius: 16,
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    borderWidth: 1,
                    borderColor: "#413f3fc3",
                    flexDirection: "row",
                    alignItems: "center",
                    elevation: 8,
                }}
            >
                {/* Spinner + Logo */}
                <View
                    style={{
                        width: 44,
                        height: 44,
                        marginRight: 14,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Image
                        source={require("../../assets/icon.png")}
                        style={{
                            width: 50,
                            height: 50,
                            position: "absolute",
                        }}
                        resizeMode="contain"
                    />
                    <Animated.View
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            borderWidth: 4,
                            borderColor: "rgba(255,255,255,0.15)",
                            borderTopColor: "white",
                            transform: [{ rotate }],
                        }}
                    />
                </View>

                {/* Text */}
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: "white",
                        }}
                    >
                        Loading{dots}
                    </Text>
                    <Text
                        style={{
                            fontSize: 12,
                            color: "#777",
                            marginTop: 2,
                        }}
                    >
                        Please wait...
                    </Text>
                </View>
            </View>
        </View>
    );
}
