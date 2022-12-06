import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import supabase from "../utils/supabase";

const queryClient = new QueryClient();

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider
        supabaseClient={supabase}
        initialSession={pageProps.initialSession}
      >
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
