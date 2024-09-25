// export const appwriteConfig = {
//     endpoint: 'https://cloud.appwrite.io/v1',
//     platform: 'com.solver.alumnit',
//     projectId: '66f415730006731132c9',
//     databaseId: '66f4407000161dfd93c1',
//     userCollectionId: '66f4409e00253b9c6f7e',
//     videoCollectionId: '66f440c7002f0b4c6487',
//     storageId: '66f4482e000afca5ef99'
// }

import { Client, Account } from "react-native-appwrite";

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('66f415730006731132c9')
    .setPlatform('com.solver.alumnit');

const account = new Account(client)

export {account, client};