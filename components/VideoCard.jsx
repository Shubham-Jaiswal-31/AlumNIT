import { useState } from "react";
import { ResizeMode, Video } from "expo-av";
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { icons } from "../constants";
import { addBookmark } from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider";

const VideoCard = ({ title, creator, avatar, thumbnail, body, postId }) => {
  const [play, setPlay] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useGlobalContext();

  const handleBookmark = async () => {
    try {
      await addBookmark(user.$id, postId); // Add the bookmark for the user
      console.log("Post bookmarked successfully!");
    } catch (error) {
      console.error("Error bookmarking post:", error);
    }
  };

  return (
    <View className="flex flex-col items-center px-4 mb-14">
      
      <View className="flex flex-row gap-3 items-start">

        <View className="justify-center items-center flex-row flex-1">

          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {creator}
            </Text>
          </View> 
        </View>

        {/* <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View> */}

        {/* Bookmark and Heart Icons */}
        <View className="flex flex-row gap-2 pt-2">
          {/* Bookmark Icon */}
          <TouchableOpacity activeOpacity={0.7} onPress={handleBookmark}>
            <Image
              source={icons.bookmark}
              className="w-5 h-5"
              resizeMode="contain"
            />
          </TouchableOpacity>
          
          {/* Heart Icon
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsLiked(!isLiked)}
          >
            <Image
              source={isLiked ? icons.heartFilled : icons.heartOutline}
              className="w-5 h-5"
              resizeMode="contain"
              style={{ tintColor: isLiked ? "red" : "gray" }}
            />
          </TouchableOpacity> */}
        </View>

      </View>

      {play ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(false)}
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
{/* 
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          /> */}
        </TouchableOpacity>
      ) : 
      (
        <>
        {/* <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          } } /> */}
         <Text onPress={() => setPlay(true)} className="text-white mt-5 px-2">{body}</Text></>
      )}
    </View>
  );
};

export default VideoCard;