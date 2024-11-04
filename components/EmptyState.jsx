import { router } from "expo-router";
import React from "react";
import { View, Text, Image } from "react-native";
import { images } from "../constants";
import CustomButton from "./CustomButton";

const EmptyState = ({ title, subtitle }) => {
  return (
    <View className="justify-center items-center px-4">
      <Image
        source={images.empty}
        resizeMode="contain"
        className="w-[270px] h-[216px]"
      />
      
      <Text className="text-xl text-center font-psemibold text-white mt-2">{title}</Text>     
      <Text className="text-sm font-pmedium text-gray-100">{subtitle}</Text>      

      <CustomButton
        title="Create Post"
        handlePress={() => router.push("/create")}
        containerStyles="w-full my-5"
      />
    </View>
  );
};

export default EmptyState;