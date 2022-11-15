import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";

const LoginPage = () => {
  const supabase = useSupabaseClient();

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
