import { FlatList, Text, View, Image, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import { getAllPosts, getLatestPosts, getAllUsers } from '../../lib/appwrite';
import SearchInput from '../../components/SearchInput';
import Trending from '../../components/Trending';
import EmptyState from '../../components/EmptyState';
import VideoCard from '../../components/VideoCard';
import useAppwrite from '../../lib/useAppwrite';
import { useGlobalContext } from "../../context/GlobalProvider";
import { MaterialIcons } from '@expo/vector-icons'; 
import UserList from '../../components/UserList';

const Home = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);
  const [refreshing, setRefreshing] = useState(false);

  const [greeting, setGreeting] = useState('');
  const [greetingIcon, setGreetingIcon] = useState('');

  const getGreetingDetails = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return { message: 'Good Morning', icon: 'wb-sunny' }; 
    } else if (currentHour < 18) {
      return { message: 'Good Afternoon', icon: 'wb-cloudy' };
    } else {
      return { message: 'Good Evening', icon: 'nights-stay' }; 
    }
  };

  useEffect(() => {
    const { message, icon } = getGreetingDetails();
    setGreeting(message);
    setGreetingIcon(icon);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const UserList = ({ currentUserId }) => {
    const [users, setUsers] = useState([]);
    const [following, setFollowing] = useState({});

    useEffect( () => {
      const fetchUsers = async () => {
        try {
          const allUsers = await getAllUsers();
          setUsers(allUsers);
        } catch (error) {
          console.error("Error fetching users: ", error);
        }
      };
      fetchUsers();
    }, [] );

    const handleFlow = async (userId) => {
      try {
        await followUser(userId, currentUserId);
        setFollowing((prev)=>({...prev, [userId]:true}));
      } catch (error) {
        console.error("Error following user");
      }
    };

    const renderUserItem = ({ item }) => (
      <View style={styles.userItem}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <Text style={styles.username}>{item.username}</Text>
        <TouchableOpacity
          style={[styles.followButton, following[item.$id] && styles.followingButton]}
          onPress={() => handleFollow(item.$id)}
          disabled={following[item.$id]}
        >
          <Text style={styles.buttonText}>
            {following[item.$id] ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }



  return (
    <SafeAreaView className="mt-10 bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            // video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
            body={item.body}
            postId={item.$id}
          />
        )}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View style={{ marginTop: 5 }}>
                <Text className="font-pmedium text-sm text-gray-100 flex-row">
                  {greeting},
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {user && user?.username}
                </Text>
              </View>
              <View className="flex-row items-center justify-end mt-1.5 space-x-4">
                <MaterialIcons
                  name={greetingIcon}
                  size={40} 
                  color="white"
                  style={{ marginRight: 100, marginBottom: 20 }}
                />
                <Image
                  source={images.logoSmall}
                  className="w-10 h-12"
                  resizeMode="contain"
                  style={{ marginBottom: 20 }}
                />
              </View>
            </View>
            <SearchInput />
            {/* <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Trending Posts
              </Text>
              <Trending posts={latestPosts ?? []} />
            </View> */}
          </View>
          
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Posts Found"
            subtitle="Be the first one to upload a post"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <UserList currentUserId={user.$id} />



    </SafeAreaView>
    
  );
};

export default Home;