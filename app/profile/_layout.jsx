import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Disable the default header
      }}
    />
  );
};

export default Layout;
