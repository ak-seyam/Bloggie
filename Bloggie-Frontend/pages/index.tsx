import Head from "next/head";
import Image from "next/image";
import InputField from "../components/shared/input";
import MainTitleText from "../components/shared/MainTitleText";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div>
      <MainTitleText text="hello" markerColor="#f00" />
      <InputField />
    </div>
  );
}
