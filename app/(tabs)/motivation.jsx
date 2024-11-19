import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useGlobalContext } from "../../context/GlobalProvider";
import { getAllQuotes } from '../../lib/appwrite';
import { useFocusEffect } from 'expo-router';

const quotes = [
  { quote: "Believe in yourself and all that you are.", author: "Christian D. Larson" },
];

const Motivation = () => {
  const flatListRef = useRef();
  const [allQuotes, setAllQuotes] = useState([]);
  const { user } = useGlobalContext(); // Get user from global context

  useFocusEffect(
    useCallback(() => {
      const fetchQuotes = async () => {
        try {
          const fetchedQuotes = await getAllQuotes(); // Fetch all quotes
          setAllQuotes(fetchedQuotes);
        } catch (error) {
          console.error("Failed to fetch quotes:", error);
        }
      };
  
      fetchQuotes();
    }, [])
  );

  const resetList = () => {
    flatListRef.current.scrollToOffset({ animated: false, offset: 0 });
  };

  return (
    <View className="flex-1 bg-primary h-full mt-10">
      <TouchableOpacity className="flex items-center justify-center mx-10 my-2 mt-5 bg-secondary px-4 py-2 rounded-lg">
        <Text className="text-white text-base">Wall Of Motivational Quotes</Text>
      </TouchableOpacity>
      <FlatList
        ref={flatListRef}
        data={allQuotes.filter((item) => item.quote)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View className="mb-8">
            <Text className="text-white text-xl font-pmedium mb-2">"{item.quote}"</Text>
            <Text className="text-gray-300 text-sm">- {item.username}</Text>
          </View>
        )}
        onEndReached={resetList}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

export default Motivation;