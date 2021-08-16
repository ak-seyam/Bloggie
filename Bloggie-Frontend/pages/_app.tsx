import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "../services/apollo-client/apollo-client.service";
import { NextPage } from "next";
import ThemeContext from "../contexts/theme/theme-context";
import { parseCookies } from "../services/parseCokkies";
import { useState } from "react";
import Cookies from "js-cookie";

interface SupplementerAppProps {
  initialThemeState: string;
}

const MyApp = ({
  Component,
  pageProps,
  initialThemeState,
}: AppProps & SupplementerAppProps) => {
  const [dark, setDarkTheme] = useState(() => {
    return JSON.parse(initialThemeState ?? "false");
  });
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeContext.Provider
        value={{
          dark,
          themeChanger: () => {
            setDarkTheme((oldVal: any) => {
              const newVal = !oldVal;
              Cookies.set("dark", JSON.stringify(newVal));
              return newVal;
            });
          },
        }}
      >
        <Component {...pageProps} />
      </ThemeContext.Provider>
    </ApolloProvider>
  );
};

MyApp.getInitialProps = async ({ ctx: { req } }: any) => {
  // give it request and it extract the cookies out of it otherwise it uses the browser's
  const cookies = parseCookies(req);
  return {
    initialThemeState: cookies.dark,
  };
};

export default MyApp;
