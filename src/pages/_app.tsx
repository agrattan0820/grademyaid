import "../styles/globals.css";
import { useState } from "react";
import type { AppProps } from "next/app";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import {
  DehydratedState,
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import supabase from "../utils/supabase";

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
  dehydratedState: DehydratedState;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <SessionContextProvider
          supabaseClient={supabase}
          initialSession={pageProps.initialSession}
        >
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen={false} />
        </SessionContextProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
