import { useCallback, useEffect, useState } from "react";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { View, Text, FlatList, TouchableOpacity, TextInput, Linking } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppwrite from "../../lib/useAppwrite";
import { getCurrentUser, getUserPosts, signOut, updateUserQuote } from "../../lib/appwrite";  
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
  const [github, setGitHub] = useState(user?.github || "");
  const [linkedin, setLinkedIn] = useState(user?.linkedin || "");
  const [followers, setFollowers] = useState(0);  // Initialize follower count
  const [inputValue, setInputValue] = useState(""); // State for the text box
  const [githubData, setGithubData] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        try {
          const updatedUser = await getCurrentUser();
          setUser(updatedUser);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      };

      fetchUserData();

      return () => {
      };
    }, [])
  );

  useEffect(() => {
    if (user?.github) {
      const fetchGithubData = async () => {
        try {
          const response = await fetch(`https://api.github.com/users/${user.github}`);
          if (!response.ok) {
            throw new Error("GitHub data fetch failed");
          }
          const data = await response.json();
          setGithubData(data); // Store GitHub data in state
        } catch (error) {
          console.error("Error fetching GitHub data:", error);
        }
      };
      fetchGithubData();
    }
  }, [user?.github]);
  const logout = async () => {
    await signOut();
    setUser(null)
    setIsLoggedIn(false)
    router.replace('/sign-in');
  }

    // Fetch followers when component mounts
    // useEffect(() => {
    //   const fetchFollowers = async () => {
    //     try {
    //       const count = await getFollowerCount(user.$id); // Fetch follower count
    //       setFollowers(count); // Set follower count
    //     } catch (error) {
    //       console.error("Failed to fetch followers:", error);
    //     }
    //   };
    //   if (user) fetchFollowers();
    // }, [user]);

    const handleSave = async () => {
      try {
        await updateUserQuote(user.$id, inputValue);
        setUser((prevUser) => ({
          ...prevUser,
          quote: inputValue
        }));
      } catch (error) {
        console.error("Failed to update quote:", error);
      }
    };
  
    const handleReset = async () => {
      try {
        // Reset the quote to null in the backend
        await updateUserQuote(user.$id, null);        
        // Update the user state locally
        setUser((prevUser) => ({
          ...prevUser,
          quote: null, // Reset quote to null
        }));    
        // Optionally clear the inputValue to prepare for a new quote
        setInputValue("");
      } catch (error) {
        console.error("Failed to reset quote:", error);
      }
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

            {user && profile ? (
              <View className="flex-row items-center">
                <TouchableOpacity 
                  onPress={() => user?.linkedin && Linking.openURL(`https://www.linkedin.com/in/${user.linkedin}`)} 
                  className="mr-4"
                >
                  <Image source={icons.linkedin} className="w-6 h-6" resizeMode="contain" />
                </TouchableOpacity>
                <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
                  <Image onPress={() => setProfile(false)} 
                    source={{uri: user?.avatar}}
                    className="w-[90%] h-[90%] rounded-lg "
                    resizeMode="cover"
                  />
                </View>
                <TouchableOpacity 
                  onPress={() => user?.github && Linking.openURL(`https://github.com/${user.github}`)} 
                  className="ml-4"
                >
                  <Image source={icons.github} className="w-6 h-6" resizeMode="contain" />
                </TouchableOpacity>
              </View>
            ) : (
              <></>
            )}

            <InfoBox 
              title={user && user?.username}
              containerStyles='mt-5 mb-0'
              titleStyles='text-lg'
            />

            {/* Display GitHub info if available */}
            {githubData && (
              <View className="mt-0">
                {githubData.company && (
                  <InfoBox
                    title={githubData.company}
                    containerStyles="mb-0"
                    titleStyles="text-sm"
                  />
                )}
                {githubData.location && (
                  <InfoBox
                    title={githubData.location}
                    containerStyles="mb-0"
                    titleStyles="text-sm"
                  />
                )}
                {githubData.bio && (
                  <InfoBox
                    title={githubData.bio}
                    containerStyles="mb-0"
                    titleStyles="text-sm"
                  />
                )}
              </View>
            )}

            <View className="mt-0 flex-row">
              <InfoBox 
                title={posts.length || 0}
                subtitle="Posts"
                containerStyles='mr-10'
                titleStyles='text-xl'
              />
              {/* let followers = ./1; */}
              <InfoBox 
                title={user && user.following ? user.following.length.toLocaleString() : "0"}  // Display the length of following array dynamically
                subtitle="Following"
                titleStyles="text-xl"
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
      {user?.quote ? (
        <View className="flex-row items-center mt-5 mb-14 w-full">
          <TextInput
            value={user.quote}
            onChangeText={setInputValue}
            className="flex-1 border border-secondary rounded-lg px-3 py-2 text-white"
          />
          <TouchableOpacity
            onPress={handleReset}
            className="ml-3 bg-secondary px-4 py-2 rounded-lg"
          >
            <Image source={icons.reset} className="w-6 h-6" resizeMode="contain" />
          </TouchableOpacity>
        </View>
      ) : (
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
      )}
    </SafeAreaView>
  )
}

export default Profile;