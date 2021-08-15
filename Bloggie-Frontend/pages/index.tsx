import Head from "next/head";
import Image from "next/image";
import { useContext, useState } from "react";
import InputField from "../components/shared/input";
import MainTitleText from "../components/shared/MainTitleText";
import ThemeContext from "../contexts/theme/theme-context";
import styles from "../styles/Home.module.css";

export default function Home() {
  const { dark, themeChanger } = useContext(ThemeContext);

  return (
    <div>
      <MainTitleText
        text="hello"
        markerColor="#f00"
        style={{
          fontSize: "4em",
        }}
      />
      <InputField />
      <input
        type="checkbox"
        name="dark"
        id="dark"
        checked={dark}
        onChange={() => {
          themeChanger();
        }}
      />
      <label htmlFor="dark">Dark?</label>
    </div>
  );
}
