import { ScrollView, Text, View, Image, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { signIn } from '../../lib/appwrite'
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes
} from "@react-native-google-signin/google-signin"

const SignIn = () => {
  const [error, setError] = useState();
  const [userInfo, setUserInfo] = useState();

  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId: "573659707281-vej3mjl2rabe6ldnrprkurejbmbk6mh2.apps.googleusercontent.com",
      // androidClientId: "573659707281-llm2qphi5k3h1kqgotnv1lrq8lvsni84.apps.googleusercontent.com",
      iosClientId: "573659707281-0d0f4f3uoo7cn1hrko153lttuasmec13.apps.googleusercontent.com",
    });
  }

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const useGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserInfo(userInfo);
      setError();
    } catch (e) {
      setError(e); 
    }
  }

  const [form, setform] = useState({
    email: '',
    password: ''  
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert('Error', 'Please fill in all the fields')
    }

    setIsSubmitting(true);
    
    try {
      await signIn(form.email, form.password, form.username);
      setUser(result);
      setIsLogged(true);
      
      Alert.alert('Success', 'User signed in successfully');
      router.replace('/home')
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image source={images.logo} resizeMode='contain' className="w-[185px] h-[55px]"/>

          <Text className="text-2xl text-white text-semibold mt-10 font-semibold">
            Log in to AlumNIT
          </Text>

          <FormField 
            title="Email"
            value={form.email}
            handleChangeText={(e) => setform({
              ...form, email: e
            })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField 
            title="Password"
            value={form.password}
            handleChangeText={(e) => setform({
              ...form, password: e
            })}
            otherStyles="mt-7"
          />

          <CustomButton 
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have account?
            </Text>
            <Link href="/sign-up" className='text-lg font-psemibold text-secondary'>Sign Up</Link>
          </View>
          <View className="justify-center items-center mt-3">
          <Text className="text-xl text-gray-100 font-pregular">Or</Text>
          </View>
          
          {/* <CustomButton 
            title="Sign In with Google"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          /> */}
          <Text className="text-xl text-gray-100 font-pregular">{JSON.stringify(error)}</Text>
          <Text className="text-xl text-gray-100 font-pregular">{JSON.stringify(userInfo)}</Text>
          <GoogleSigninButton 
            size={GoogleSigninButton.Size.Standard}
            color={GoogleSigninButton.Color.Dark}
            onPress={useGoogleSignIn}
          />

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn
