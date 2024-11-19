import { useState } from "react";
import { ResizeMode, Video } from "expo-av";
import React from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { icons } from "../constants";
import { addBookmark, followUser, unfollowUser } from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider";
import { router } from "expo-router";

const VideoCard = ({ title, creator, avatar, thumbnail, body, postId, visible = true }) => {
  const [play, setPlay] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useGlobalContext();
  const getReadTime = (text) => {
    const wordCount = text.split(" ").length;
    const wordsPerMinute = 200;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return readTime;
  };

  const handleBookmark = async () => {
    try {
      const res = await addBookmark(user.$id, postId);
      Alert.alert("", res);
    } catch (error) {
      console.error("Error bookmarking post:", error);
    }
  };

  const handleFollow = async () => {
    try {
      await followUser(user.$id, creator);  
      Alert.alert("Success", "You are now following this creator!");
    } catch (error) {
      console.error("Error following creator:", error);
    }
  };
  // handleUnFollow function to remove creator from current user's following list
  const handleUnFollow = async () => {
    try {
      await unfollowUser(user.$id, creator);
      Alert.alert("Success", "You have unfollowed this creator.");
    } catch (error) {
      console.error("Error unfollowing creator:", error);
    }
  };
  
  const readTime = getReadTime(body);

  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
        <TouchableOpacity
          onPress={() => router.push("/profile")} // Redirect to profile page
          className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5"
        >
          <Image
            source={{ uri: avatar }}
            className="w-full h-full rounded-lg"
            resizeMode="cover"
          />
        </TouchableOpacity>

          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text className="font-psemibold text-sm text-white" numberOfLines={1}>
              {title}
            </Text>
            <Text className="text-xs text-gray-100 font-pregular" numberOfLines={1}>
              {creator}
            </Text>
            <Text className="text-xs text-gray-400 mt-2">
              Estimated Read Time: {readTime} min 
            </Text>
          </View>
        </View>



{/* 

        <View style={styles.card}>
      <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
      <View style={styles.info}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.creator}>{creator}</Text>
        </View>
        <TouchableOpacity onPress={handleFollow} disabled={isFollowing}>
          <MaterialIcons
            name={isFollowing ? "person" : "person-add"}
            size={24}
            color={isFollowing ? "green" : "white"}
          />
        </TouchableOpacity>
      </View>
    </View>


 */}

        {/* <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View> */}

        {visible && (
          <View className="flex flex-row gap-2 pt-2">
            <TouchableOpacity activeOpacity={0.7} onPress={handleBookmark}>
              <Image
                source={icons.bookmark}
                className="w-5 h-5"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsLiked(!isLiked)}
            >
              <Image
                source={isLiked ? icons.red : icons.grey}
                className="w-5 h-5"
                resizeMode="contain"
              />
            </TouchableOpacity>
            </View>
        )}
        {user && user.username !== creator && visible && (
          <View className="flex gap-1.5 pt-2">
            {user.following.includes(creator) ? (
              // Show Unfollow button if already following
              <TouchableOpacity activeOpacity={0.7} onPress={handleUnFollow}>
                <Image
                  source={icons.unfollow}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ) : (
              // Show Follow button if not following
              <TouchableOpacity activeOpacity={0.7} onPress={handleFollow}>
                <Image
                  source={icons.follow}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {thumbnail && play ? (
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
      ) : (
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
          <Text onPress={() => setPlay(true)} className="text-white mt-5 px-2">
            {body}
          </Text>
        </>
      )}
    </View>
  );
};

// const styles = StyleSheet.create({
//   card: { marginBottom: 16, backgroundColor: '#333', borderRadius: 8, overflow: 'hidden' },
//   thumbnail: { width: '100%', height: 180 },
//   info: { flexDirection: 'row', padding: 10, alignItems: 'center' },
//   avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
//   textContainer: { flex: 1 },
//   title: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
//   creator: { fontSize: 14, color: '#aaa' },
// });

export default VideoCard;