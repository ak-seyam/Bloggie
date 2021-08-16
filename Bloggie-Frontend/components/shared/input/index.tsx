import { FC, HTMLProps } from "react";
import classes from "./styles.module.scss";

interface SearchBarProps extends HTMLProps<HTMLInputElement> {}

const InputField: FC<SearchBarProps> = (props) => {
  return <input className={classes["search"]} {...props}></input>;
};

export default InputField;
