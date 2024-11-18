import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { View, Text, FlatList, TouchableOpacity, TextInput } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppwrite from "../../lib/useAppwrite";
import { getUserPosts, signOut, getFollowerCount } from "../../lib/appwrite";   // Assuming getFollowerCount fetches followers
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from "../../context/GlobalProvider";
import { Image } from "react-native-animatable";
import InfoBox from "../../components/InfoBox";
import { icons } from "../../constants";
// import Icon from 'react-native-vector-icons/MaterialIcons';
// <div class="badge-base LI-profile-badge" data-locale="en_US" data-size="medium" data-theme="dark" data-type="VERTICAL" data-vanity="satya-prakash-mahour" data-version="v1"><a class="badge-base__link LI-simple-link" href="https://in.linkedin.com/in/satya-prakash-mahour?trk=profile-badge">Satya Prakash Mahour</a></div>
              
const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: posts } = useAppwrite(() => getUserPosts(user.$id));
  const [profile, setProfile] = useState(true);

  const [followers, setFollowers] = useState(0);  // Initialize follower count
  const [inputValue, setInputValue] = useState(""); // State for the text box

  const logout = async () => {
    await signOut();
    setUser(null)
    setIsLoggedIn(false)
    router.replace('/sign-in');
  }

    // Fetch followers when component mounts
    useEffect(() => {
      const fetchFollowers = async () => {
        try {
          const count = await getFollowerCount(user.$id); // Fetch follower count
          setFollowers(count); // Set follower count
        } catch (error) {
          console.error("Failed to fetch followers:", error);
        }
      };
      if (user) fetchFollowers();
    }, [user]);

    const handleSave = () => {
      console.log("Saved input:", inputValue);
      // Add logic to handle the input value (e.g., save to a database)
    };

  return (
    <SafeAreaView className="bg-primary mt-10 h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard thumbnail={item.thumbnail}
          title={item.title}
          creator={item.creator.username}
          avatar={item.creator.avatar}
          body={item.body}
          visible={false}/>
        )}
        ListHeaderComponent={() => (
          <View className="w-full justify-center items-center mb-12 px-4">
            <TouchableOpacity
              className="w-full items-end mb-10"
              onPress={logout}
            >
              <Image source={icons.logout} resizeMode="contain" className="w-6 h-6" />
            </TouchableOpacity>

              {profile ? (
                <>
                <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
                <Image onPress={() => setProfile(false)} 
                source={{uri: user?.avatar}}
                className="w-[90%] h-[90%] rounded-lg "
                resizeMode="cover"
               />
                </View>
                </>
              ) : (
                <>
                {/* <View onPress={() => setProfile(true)} class="badge-base LI-profile-badge" data-locale="en_US" data-size="medium" data-theme="dark" data-type="VERTICAL" data-vanity="satya-prakash-mahour" data-version="v1"><a class="badge-base__link LI-simple-link" href="https://in.linkedin.com/in/satya-prakash-mahour?trk=profile-badge">Satya Prakash Mahour</a></View> */}
                </>
              )}

            <InfoBox 
              title={user && user?.username}
              containerStyles='mt-5'
              titleStyles='text-lg'
            />

            <View className="mt-5 flex-row">
              <InfoBox 
                title={posts.length || 0}
                subtitle="Posts"
                containerStyles='mr-10'
                titleStyles='text-xl'
              />
              {/* let followers = ./1; */}
              <InfoBox 
                // title="1.2k"
                title={followers.toLocaleString()}  // Display followers count
                subtitle="Followers"
                titleStyles='text-xl'
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Posts Found"
            subtitle="No posts found for this search query"
          />
        )}
      />
      <View className="flex-row items-center mt-5 mb-14 w-full">
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Enter your quote here"
          placeholderTextColor="#A1A1A1"
          className="flex-1 border border-secondary rounded-lg px-3 py-2 text-white"
        />
        <TouchableOpacity
          onPress={handleSave}
          className="ml-3 bg-secondary px-4 py-2 rounded-lg"
        >
          <Image source={icons.save} className="w-6 h-6" resizeMode="contain" />
        </TouchableOpacity>
      </View>
      <View className="flex-row items-center mt-5 mb-20 w-full">
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Enter your quote here"
          placeholderTextColor="#A1A1A1"
          className="flex-1 border border-secondary rounded-lg px-3 py-2 text-white"
        />
        <TouchableOpacity
          onPress={handleSave}
          className="ml-3 bg-secondary px-4 py-2 rounded-lg"
        >
          <Image source={icons.edit} className="w-6 h-6" resizeMode="contain" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Profile;