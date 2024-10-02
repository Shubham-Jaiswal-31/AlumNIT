// import { useState } from "react";
// import { ResizeMode, Video } from "expo-av";
// import * as Animatable from "react-native-animatable";
// import {
//   FlatList,
//   Image,
//   ImageBackground,
//   TouchableOpacity,
// } from "react-native";
// import { icons } from "../constants";
import { Text } from 'react-native'
import React from 'react'

const Trending = ({ posts }) => {
  return (
    <FlatList
      data={posts} 
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <Text className="text-3xl text-white">{item.id}</Text>
      )}
      horizontal
    />
  );
};

export default Trending;