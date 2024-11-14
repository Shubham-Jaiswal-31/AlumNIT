import { ScrollView, Text, Alert, Image, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import FormField from '../../components/FormField'
import { ResizeMode, Video, resizeMode } from 'expo-av'
import { icons } from '../../constants'
import * as ImagePicker from 'expo-image-picker'
import * as DocumentPicker from "expo-document-picker";
import { router, useGlobalSearchParams } from 'expo-router'
import { setupURLPolyfill } from 'react-native-url-polyfill'
import { createVideo } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';


const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    thumbnail: null,
    body: ''
  })

  const openPicker = async (selectType) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });

    if(!result.canceled){
      if(selectType==='image'){
        setForm({ ...form, thumbnail: result.assets[0] })
      }
      // if(selectType==='video'){
      //   setForm({ ...form, video: result.assets[0] })
      // }
      else {
        setTimeout(() => {
          Alert.alert("Document picked", JSON.stringify(result, null, 2));
        }, 100);
      }
    }
  }

  const submit = async () => {
    if(form.body==="" || form.title==="" || form.thumbnail===""){
      return Alert.alert('Please fill in all the fields')
    }
    setUploading(true);

    try { 
      await createVideo({
        ...form, userId: user.$id
      })

      Alert.alert('Success', 'Post Uploaded successfully')
      router.push('/home')
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setForm({
        title: '',
        thumbnail: null,
        body: ''
      })

      setUploading(false);
    }
  }

  return (
    <SafeAreaView className="bg-primary my-10 h-full">
      <ScrollView className="px-4">
        <Text className="text-2xl text-white font-psemibold">
          Upload Post
        </Text>

        <FormField 
          title="Post Title"
          value={form.title}
          placeholder="Give your post a catchy title..."
          handleChangeText={(e)=>setForm({ ...form,
            title: e
          })}
          otherStyles="mt-10"
        />

        {/* <View className="mt-7 space-y-2">
          <Text className="text-base text-grey-100 font-pmedium">
            Upload Post
          </Text> */}
{/* 
          <TouchableOpacity onPress={()=> openPicker('video')}>
                <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                  <View className="w-14 h-14 border border-dashed border-secodary-100 justify-center items-center">
                    <Image source={icons.upload}
                    resizeMode="contain" className="w-1/2 h-1/2" />
                  </View>
                </View>
          </TouchableOpacity> */}
        {/* </View> */}

        <View className="mt-7 space-y-2">
          <Text className="text-base text-white font-pmedium">
              Post Image
          </Text>

          <TouchableOpacity onPress={()=> openPicker('image')} >
            {form.thumbnail ?(
                <Image 
                  source={{ uri:form.thumbnail.uri }}
                  resizeMode='cover'
                  className="w-full h-64 rounded-2xl"     
                />
              ):(
                <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                  <Image source={icons.upload}
                  resizeMode="contain" className="w-5 h-5" alt='upload' />
                  <Text className="text-sm text-gray-100 font-pmedium">
                    Choose a file
                  </Text>
                </View>
              )}
          </TouchableOpacity>
        </View>

        <FormField 
          title="Body"
          value={form.body}
          placeholder="The content of your post"
          handleChangeText={(e)=>setForm({ ...form,
            body: e
          })}
          otherStyles="mt-7"
        />

        <CustomButton 
          title="Submit"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />

      </ScrollView>
    </SafeAreaView>
  )
}

export default Create