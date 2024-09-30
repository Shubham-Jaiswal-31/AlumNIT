import { ScrollView, Text, View, Image, Alert, TextInput } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import { createUser } from '../../lib/appwrite';

const generateCaptcha = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const length = 6;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const SignUp = () => {
  const [form, setform] = useState({
    username: '',
    email: '',
    password: ''  
  });
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "" || captchaInput === "") {
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }
    if (captchaInput !== captcha) {
      Alert.alert('Error', 'CAPTCHA does not match');
      setCaptcha(generateCaptcha());
      setCaptchaInput('');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await createUser(form.email, form.password, form.username);
      router.replace('/home');
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
          <Image source={images.logo} resizeMode='contain' className="w-[185px] h-[45px]"/>
          <Text className="text-2xl text-white text-semibold mt-10 font-semibold">
            Sign up to AlumNIT
          </Text>
          <FormField 
            title="Username"
            value={form.username}
            handleChangeText={(e) => setform({ ...form, username: e })}
            otherStyles="mt-10"
          />
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
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link href="/sign-in" className='text-lg font-psemibold text-secondary'>Sign In</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;