import "../styles/globals.css";
import type { AppProps } from "next/app";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

function MyApp({
  Component,
  pageProps,
  
}: AppProps<{
  initialSession: Session;
}>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
