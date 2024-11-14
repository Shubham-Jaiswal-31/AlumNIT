import { store } from "expo-router/build/global-state/router-store";
// import { enabledPlugins, Formidable } from "formidable";
// import { errorMonitor } from "formidable/Formidable";
// import { TIS620_THAI_CI, UCS2_POLISH_CI } from "mysql/lib/protocol/constants/charsets";
import { Account, Avatars, Client, Functions, Databases, ID, Query, Storage } from "react-native-appwrite";


export const appwriteConfig = {
	endpoint: "https://cloud.appwrite.io/v1",
	platform: "com.solver.alumnit",
	projectId: "66f415730006731132c9",
	databaseId: "66f4407000161dfd93c1",
	userCollectionId: "66f4409e00253b9c6f7e",
	videoCollectionId: "66f440c7002f0b4c6487",
	storageId: "66f4482e000afca5ef99",
  bookmarkCollectionId: "6734df2d000d1582a7e6", // ID for the bookmarks collection
};

const {
    endpoint,
	platform,
	projectId,
	databaseId,
	userCollectionId,

	videoCollectionId,
	storageId,
} = appwriteConfig;

const client = new Client();

client
	.setEndpoint(appwriteConfig.endpoint)
	.setProject(appwriteConfig.projectId)
	.setPlatform(appwriteConfig.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client); 
const storage = new Storage(client); 
const functions = new Functions(client);   //------------------//

export const createUser = async (email, password, username) => {
	try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl
            }
        );

        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

const deleteSessionManually = async() => {
  try {
    const activeSessions = await account.listSessions();
    if (activeSessions.total > 0) {
      await account.deleteSession("current")    
    }
  } catch (error) {
    console.log("No session available.");
  }
};
export const signIn = async (email, password) => {
    try {
        // await account.deleteSession("current");
        await deleteSessionManually();
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export const createGoogleSession = async (token) => {
  try {
    // You can use the `account.createOAuth2Session` method to handle this.
    const session = await account.createOAuth2Session('google', token);

    return session;
  } catch (error) {
    console.error("Google session creation failed:", error);
    throw new Error(error);
  }
};

export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      throw new Error(error);
    }
  }

//   export async function getCurrentAvatar() {
//     try {
//         const currentAccount = await getAccount();

//         if (!currentAccount) throw Error;

//         const currentUser = await databases.listDocuments(
//             appwriteConfig.databaseId,
//             appwriteConfig.userCollectionId,
//             [Query.equal('accountId', currentAccount.$id)]
//         )

//         if (!currentUser) throw Error;
//         console.log('currentUser',currentUser);
//         return currentUser;
//     } catch (error) {
//         console.log(error);
//         return null;
//     }
// }

  export async function getCurrentUser() {
    try {
        const currentAccount = await getAccount();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if (!currentUser) throw Error;
        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function signOut() {
    try {
      const session = await account.deleteSession("current");
      return session;
    } catch (error) {
      throw new Error(error);
    }
}

export async function getAllPosts() {
    try {
      const posts = await databases.listDocuments(
        databaseId,
        videoCollectionId,
        [Query.orderDesc("$createdAt")]
      )  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }

  export async function getLatestPosts() {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        [Query.orderDesc("$createdAt"), Query.limit(7)]
      );
  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }
  export async function searchPosts(query) {
    try {
      const posts = await databases.listDocuments(
        databaseId,
        videoCollectionId,
        [Query.search("title", query)]
      )
  
      // if (!posts) throw new Error("Something went wrong");
  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }

  
  export async function getUserPosts(userId) {
    try {
      const posts = await databases.listDocuments(
        databaseId,
        videoCollectionId,
        [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
      )
  
      // if (!posts) throw new Error("Something went wrong");
  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }

  export const getFilePreview = async (fileId, type) => {
    let fileUrl;

    try {
      // if(type === 'video'){
      //   fileUrl = storage.getFileView(storageId, fileId)
      // } else
      if(type === 'image'){
        fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100)
      } else{
        throw new Error('Invalid file type')
      }

      if(!fileUrl)  throw Error;

      return fileUrl;
    } catch (error) {
      throw new Error(error);
    }
  }

  export const uploadFile = async (file, type) => {
    if(!file) return;

    const asset = { 
      name: file.fileName,
      type: file.mimeType,
      size: file.fileSize,
      uri: file.uri,
     };


    try {
      const uploadFile = await storage.createFile(
        storageId,
        ID.unique(),
        asset
      );


      const fileUrl = await getFilePreview(uploadFile.$id, type);
      return fileUrl;
    } catch (error) {
      throw new Error(error);
    }
  }

  export const createVideo = async (form) => {
    try {
      const [thumbnailUrl] = await Promise.all([
        uploadFile(form.thumbnail, 'image')
        // uploadFile(form.video, 'video'),
      ])


      const newPost = await databases.createDocument(
        databaseId, videoCollectionId, ID.unique(), {
          title: form.title,
          thumbnail: thumbnailUrl,
          // video: videoUrl,
          body: form.body,
          creator: form.userId
        }
      )

      return newPost;
    } catch (error) {
      throw new Error(error);
    }
  }

// export const createGoogleSession = async (token) => {
//     try {
//       const session = await account.createOAuth2Session('google', token);  
//       return session;
//     } catch (error) {
//       console.error("Google session creation failed:", error);
//       throw new Error(error);
//     }
//   };



// export const getFollowerCount = async (userId) => {
//   // Add your API logic here
//   const response = await api.get(`/followers/count?userId=${userId}`);
//   return response.data.count;
// };

export const getFollowerCount = async (userId) => {
  try {
    const response = await functions.createExecution("6734dfcc001c7c15f6f4", JSON.stringify({ userId }));
    const { followerCount } = JSON.parse(response.response);
    return followerCount;
  } catch (error) {
    console.error("Error fetching follower count:", error);
    return 0;
  }
};




// Function to add a bookmark
export const addBookmark = async (userId, postId) => {
  try {
    const bookmark = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bookmarkCollectionId, // Create a separate collection for bookmarks
      ID.unique(),
      {
        userId: userId,
        postId: postId,
      }
    );
    return bookmark;
  } catch (error) {
    console.error("Failed to add bookmark:", error);
    throw new Error(error);
  }
};

// Function to fetch bookmarks for a specific user
export const getBookmarks = async (userId) => {
  try {
    const bookmarks = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bookmarkCollectionId,
      [Query.equal("userId", userId)]
    );

    const postIds = bookmarks.documents.map((doc) => doc.postId);

    // Fetch all bookmarked posts by their IDs
    const posts = await Promise.all(
      postIds.map((id) =>
        databases.getDocument(appwriteConfig.databaseId, appwriteConfig.videoCollectionId, id)
      )
    );

    return posts;
  } catch (error) {
    console.error("Failed to fetch bookmarks:", error);
    throw new Error(error);
  }
};