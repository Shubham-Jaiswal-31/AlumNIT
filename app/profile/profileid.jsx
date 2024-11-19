import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native-animatable";
import { useGlobalContext } from "../../context/GlobalProvider";
import { updateUserGitHub, updateUserLinkedIn, updateUsername } from "../../lib/appwrite";
import { icons, images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";

const ProfileID = () => {
  const { user, setUser } = useGlobalContext();
  const [github, setGitHub] = useState(user?.github || "");
  const [linkedin, setLinkedIn] = useState(user?.linkedin || "");
  const [username, setUsername] = useState(user?.username || "");

  const handleGitHubSave = async () => {
    try {
      const updatedUser = await updateUserGitHub(user.$id, github);
      setUser((prevUser) => ({ ...prevUser, github: updatedUser.github }));
    } catch (error) {
      console.error("Failed to update GitHub:", error);
    }
  };

  const handleGitHubReset = async () => {
    try {
      await updateUserGitHub(user.$id, null);
      setUser((prevUser) => ({ ...prevUser, github: null }));
      setGitHub("");
    } catch (error) {
      console.error("Failed to reset GitHub:", error);
    }
  };

  const handleLinkedInSave = async () => {
    try {
      const updatedUser = await updateUserLinkedIn(user.$id, linkedin);
      setUser((prevUser) => ({ ...prevUser, linkedin: updatedUser.linkedin }));
    } catch (error) {
      console.error("Failed to update LinkedIn:", error);
    }
  };

  const handleUsernameSave = async () => {
    try {
      const updatedUser = await updateUsername(user.$id, username);
      setUser((prevUser) => ({ ...prevUser, username: updatedUser.username }));
    } catch (error) {
      console.error("Failed to update Username:", error);
    }
  };

  const handleLinkedInReset = async () => {
    try {
      await updateUserLinkedIn(user.$id, null);
      setUser((prevUser) => ({ ...prevUser, linkedin: null }));
      setLinkedIn("");
    } catch (error) {
      console.error("Failed to reset LinkedIn:", error);
    }
  };

  const handleUsernameReset = async () => {
    try {
      await updateUsername(user.$id, null);
      setUser((prevUser) => ({ ...prevUser, username: null }));
      setUsername("");
    } catch (error) {
      console.error("Failed to reset Username:", error);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full mt-10 px-4">
      <View className="mt-4 mb-4">
      <View className="justify-center items-center mb-4">
        <Text className="text-xl font-semibold text-white">
          Profile Details
        </Text>
      </View>
      </View>
      {user?.github ? (
        <View className="flex-row items-center mt-5 mb-4 w-full">
          <Image source={icons.github} className="w-6 h-6 mr-2" resizeMode="contain" />
          <TextInput
            value={github}
            onChangeText={setGitHub}
            className="flex-1 border border-secondary rounded-lg px-3 py-2 text-white"
          />
          <TouchableOpacity
            onPress={handleGitHubReset}
            className="ml-3 bg-secondary px-4 py-2 rounded-lg"
          >
            <Image source={icons.reset} className="w-6 h-6" resizeMode="contain" />
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-row items-center mt-5 mb-4 w-full">
          <Image source={icons.github} className="w-6 h-6 mr-2" resizeMode="contain" />
          <TextInput
            value={github}
            onChangeText={setGitHub}
            placeholder="Enter your GitHub Username"
            placeholderTextColor="#A1A1A1"
            className="flex-1 border border-secondary rounded-lg px-3 py-2 text-white"
          />
          <TouchableOpacity
            onPress={handleGitHubSave}
            className="ml-3 bg-secondary px-4 py-2 rounded-lg"
          >
            <Image source={icons.save} className="w-6 h-6" resizeMode="contain" />
          </TouchableOpacity>
        </View>
      )}

      {user?.linkedin ? (
        <View className="flex-row items-center mt-5 mb-4 w-full">
          <Image source={icons.linkedin} className="w-6 h-6 mr-2" resizeMode="contain" />
          <TextInput
            value={linkedin}
            onChangeText={setLinkedIn}
            className="flex-1 border border-secondary rounded-lg px-3 py-2 text-white"
          />
          <TouchableOpacity
            onPress={handleLinkedInReset}
            className="ml-3 bg-secondary px-4 py-2 rounded-lg"
          >
            <Image source={icons.reset} className="w-6 h-6" resizeMode="contain" />
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-row items-center mt-5 mb-4 w-full">
          <Image source={icons.linkedin} className="w-6 h-6 mr-2" resizeMode="contain" />
          <TextInput
            value={linkedin}
            onChangeText={setLinkedIn}
            placeholder="Enter your LinkedIn Username"
            placeholderTextColor="#A1A1A1"
            className="flex-1 border border-secondary rounded-lg px-3 py-2 text-white"
          />
          <TouchableOpacity
            onPress={handleLinkedInSave}
            className="ml-3 bg-secondary px-4 py-2 rounded-lg"
          >
            <Image source={icons.save} className="w-6 h-6" resizeMode="contain" />
          </TouchableOpacity>
        </View>
      )}

      {user?.username ? (
        <View className="flex-row items-center mt-5 mb-4 w-full">
          <Image source={icons.profile} className="w-6 h-6 mr-2" resizeMode="contain" />
          <TextInput
            value={username}
            onChangeText={setUsername}
            className="flex-1 border border-secondary rounded-lg px-3 py-2 text-white"
          />
          <TouchableOpacity
            onPress={handleUsernameReset}
            className="ml-3 bg-secondary px-4 py-2 rounded-lg"
          >
            <Image source={icons.reset} className="w-6 h-6" resizeMode="contain" />
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-row items-center mt-5 mb-4 w-full">
          <Image source={icons.profile} className="w-6 h-6 mr-2" resizeMode="contain" />
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your LinkedIn Username"
            placeholderTextColor="#A1A1A1"
            className="flex-1 border border-secondary rounded-lg px-3 py-2 text-white"
          />
          <TouchableOpacity
            onPress={handleUsernameSave}
            className="ml-3 bg-secondary px-4 py-2 rounded-lg"
          >
            <Image source={icons.save} className="w-6 h-6" resizeMode="contain" />
          </TouchableOpacity>
        </View>
      )}

        
        <View className="justify-center items-center mt-5 mb-5">
          <Image
            source={images.motivationalquote}
            className="w-[300px] h-[200px]"
            resizeMode="contain"
          />
        </View>
        <CustomButton
            title="Back"
            handlePress={() => router.push('/home')}
            containerStyles="w-full mt-7"
          />
    </SafeAreaView>
  );
};

export default ProfileID;