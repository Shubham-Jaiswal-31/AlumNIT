// app/motivation.jsx
import React, { useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

const quotes = [
  { quote: "Believe in yourself and all that you are.", author: "Christian D. Larson" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Success is not the key to happiness. Happiness is the key to success.", author: "Albert Schweitzer" },
  { quote: "Don't wait for opportunity. Create it.", author: "Anonymous" },
  { quote: "Your limitation—it's only your imagination.", author: "Anonymous" },
  { quote: "Great things never come from comfort zones.", author: "Anonymous" },
  { quote: "Dream it. Wish it. Do it.", author: "Anonymous" },
  { quote: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Anonymous" },
  { quote: "Success doesn't just find you. You have to go out and get it.", author: "Anonymous" },
  { quote: "The key to success is to focus on goals, not obstacles.", author: "Anonymous" },
  { quote: "Dream bigger. Do bigger.", author: "Anonymous" },
  { quote: "Don't stop when you're tired. Stop when you're done.", author: "Anonymous" },
  { quote: "Wake up with determination. Go to bed with satisfaction.", author: "Anonymous" },
  { quote: "Push yourself, because no one else is going to do it for you.", author: "Anonymous" },
  { quote: "Great things are not done by impulse, but by a series of small things brought together.", author: "Anonymous" },
  { quote: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "The best way to predict your future is to create it.", author: "Abraham Lincoln" },
  { quote: "Success is not how high you have climbed, but how you make a positive difference to the world.", author: "Roy T. Bennett" },
  { quote: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { quote: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { quote: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { quote: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { quote: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { quote: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
  { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { quote: "Keep your face always toward the sunshine—and shadows will fall behind you.", author: "Walt Whitman" },
  { quote: "Opportunities don't happen, you create them.", author: "Chris Grosser" },
  { quote: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { quote: "Don't limit your challenges. Challenge your limits.", author: "Anonymous" },
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { quote: "Act as if what you do makes a difference. It does.", author: "William James" },
  { quote: "Success is not in what you have, but who you are.", author: "Bo Bennett" },
  { quote: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { quote: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus" },
  { quote: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { quote: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { quote: "Doubt kills more dreams than failure ever will.", author: "Suzy Kassem" },
  { quote: "The best revenge is massive success.", author: "Frank Sinatra" },
  { quote: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { quote: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
  { quote: "Keep going. Be all in.", author: "Anonymous" },
  { quote: "Do one thing every day that scares you.", author: "Eleanor Roosevelt" },
  { quote: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
  { quote: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { quote: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { quote: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { quote: "You just can't beat the person who never gives up.", author: "Babe Ruth" },
  { quote: "If you can dream it, you can do it.", author: "Walt Disney" },
  { quote: "It's not whether you get knocked down, it's whether you get up.", author: "Vince Lombardi" },
  { quote: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { quote: "I am not a product of my circumstances. I am a product of my decisions.", author: "Stephen R. Covey" },
  { quote: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" }
];

const Motivation = () => {
  const flatListRef = useRef();

  const resetList = () => {
    flatListRef.current.scrollToOffset({ animated: false, offset: 0 });
  };

  return (
    <View className="flex-1 bg-primary h-full mt-10">
      <TouchableOpacity className="mx-3 my-2 bg-secondary px-4 py-2 rounded-lg">
        <Text className="text-white text-base">Some Quotes from people...</Text>
      </TouchableOpacity>
      <FlatList
        ref={flatListRef}
        data={quotes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View className="mb-8">
            <Text className="text-white text-xl font-pmedium mb-2">"{item.quote}"</Text>
            <Text className="text-gray-300 text-sm">- {item.author}</Text>
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