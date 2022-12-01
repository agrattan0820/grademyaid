import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import supabase from "../utils/supabase";

const LoginPage = () => {
  console.log(supabase);

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      theme="default"
      providers={["google", "facebook"]} //specify google,facebook sso
      socialLayout="horizontal"
    />
  );
};

export default LoginPage;
