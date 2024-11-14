import { useEffect, useState } from "react";
import { Text, FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getBookmarks } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import VideoCard from "../../components/VideoCard";

const Bookmark = () => {
  const { user } = useGlobalContext();
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const bookmarks = await getBookmarks(user.$id);
        setBookmarkedPosts(bookmarks);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    };
    if (user) fetchBookmarks();
  }, [user]);

  return (
    <SafeAreaView className="px-4 my-6 bg-primary h-full">
      <Text className="text-2xl text-white font-semibold">Bookmarks</Text>
      <FlatList
        data={bookmarkedPosts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard post={item} />
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center">
            <Text className="text-white">No Bookmarks Yet</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Bookmark;