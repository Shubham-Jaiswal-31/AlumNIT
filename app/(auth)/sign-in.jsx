import { ScrollView, Text, View, Image, Alert, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import { signIn, getCurrentUser } from '../../lib/appwrite';
import { useGlobalContext } from "../../context/GlobalProvider";


const generateCaptcha = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const length = 6; 
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const SignIn = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [captcha, setCaptcha] = useState(generateCaptcha()); 
  const [captchaInput, setCaptchaInput] = useState('');
  const [form, setform] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (form.email === "") {
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }

    // if (captchaInput !== captcha) {
    //   Alert.alert('Error', 'CAPTCHA does not match');
    //   setCaptcha(generateCaptcha());
    //   setCaptchaInput(''); 
    //   return;
    // }

    setIsSubmitting(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLoggedIn(true);
      Alert.alert("Success", "User signed in successfully");
      router.replace("/home");
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image source={images.logo} resizeMode='contain' className="w-[185px] h-[55px]" />

          <Text className="text-2xl text-white text-semibold mt-5 font-semibold">
            Log in to AlumNIT
          </Text>

          <FormField 
            title="Email"
            value={form.email}
            handleChangeText={(e) => setform({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField 
            title="Password"
            value={form.password}
            handleChangeText={(e) => setform({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <View style={{ marginTop: 15 }}>
            <Text className="text-lg text-white">CAPTCHA: {captcha}</Text>
            <TextInput
              style={{ 
                height: 40, 
                borderColor: 'gray', 
                borderWidth: 1, 
                borderRadius: 5, 
                padding: 10, 
                color: 'white',
                marginTop: 10 
              }}
              placeholder="Enter CAPTCHA"
              placeholderTextColor="lightgray" 
              value={captchaInput}
              onChangeText={setCaptchaInput}
            />
          </View>

          <CustomButton 
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
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
          {/* <View style={{ 
            width: '100%', 
            height: 60, 
            marginTop: 15, 
            borderRadius: 30, 
            overflow: 'hidden' 
          }}>
            <TouchableOpacity 
              style={{ 
                flex: 1, 
                justifyContent: 'center', 
                alignItems: 'center', 
                backgroundColor: '#4285F4', // Google sign-in color
                borderRadius: 30 
              }}
              onPress={useGoogleSignIn}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                Sign in with Google
              </Text>
            </TouchableOpacity>
          </View> */}
          {/* <View style={{ 
            width: '100%', 
            height: 60, 
            marginTop: 15, 
            borderRadius: 25, 
            overflow: 'hidden'
          }}>
            <GoogleSigninButton 
              style={{ width: '100%', height: '100%' }}
              size={GoogleSigninButton.Size.Wide} 
              color={GoogleSigninButton.Color.Dark}
              onPress={useGoogleSignIn}
            />
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;