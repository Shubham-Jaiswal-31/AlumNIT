import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
// import { getAllUsers, followUser } from '../../lib/appwrite';


// const UserList = ({ currentUserId }) => {
//   const [users, setUsers] = useState([]);
//   const [following, setFollowing] = useState({});

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const allUsers = await getAllUsers();
//         setUsers(allUsers);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };
//     fetchUsers();
//   }, []);

//   const handleFollow = async (userId) => {
//     try {
//       await followUser(userId, currentUserId);
//       setFollowing((prev) => ({ ...prev, [userId]: true }));
//     } catch (error) {
//       console.error("Error following user:", error);
//     }
//   };

//   const renderUserItem = ({ item }) => (
//     <View style={styles.userItem}>
//       <Image source={{ uri: item.avatar }} style={styles.avatar} />
//       <Text style={styles.username}>{item.username}</Text>
//       <TouchableOpacity
//         style={[styles.followButton, following[item.$id] && styles.followingButton]}
//         onPress={() => handleFollow(item.$id)}
//         disabled={following[item.$id]}
//       >
//         <Text style={styles.buttonText}>
//           {following[item.$id] ? "Following" : "Follow"}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <FlatList
//       data={users.filter((user) => user.$id !== currentUserId)} // Exclude current user
//       keyExtractor={(item) => item.$id}
//       renderItem={renderUserItem}
//       contentContainerStyle={styles.list}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   list: { padding: 16 },
//   userItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//     backgroundColor: "#f9f9f9",
//     padding: 10,
//     borderRadius: 8,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 12,
//   },
//   username: { flex: 1, fontSize: 16, fontWeight: "bold" },
//   followButton: {
//     backgroundColor: "#007bff",
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 4,
//   },
//   followingButton: {
//     backgroundColor: "#6c757d",
//   },
//   buttonText: { color: "#fff", fontWeight: "bold" },
// });

// export default UserList;






const UserList = ({ currentUserId }) => {
    const [users, setUsers] = useState([]);
    const [following, setFollowing] = useState({});
  
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const allUsers = await getAllUsers();
          setUsers(allUsers);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
      fetchUsers();
    }, []);
  
    const handleFollow = async (userId) => {
      try {
        await followUser(currentUserId, userId); // Call the backend API
        setFollowing((prev) => ({ ...prev, [userId]: true }));
      } catch (error) {
        console.error("Error following user:", error);
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
  
    return (
      <FlatList
        data={users.filter((user) => user.$id !== currentUserId)} // Exclude the current user
        keyExtractor={(item) => item.$id}
        renderItem={renderUserItem}
        contentContainerStyle={styles.list}
      />
    );
  };
  
  const styles = StyleSheet.create({
    list: { padding: 16 },
    userItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
      backgroundColor: "#f9f9f9",
      padding: 10,
      borderRadius: 8,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    username: { flex: 1, fontSize: 16, fontWeight: "bold" },
    followButton: {
      backgroundColor: "#007bff",
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 4,
    },
    followingButton: {
      backgroundColor: "#6c757d",
    },
    buttonText: { color: "#fff", fontWeight: "bold" },
  });
  