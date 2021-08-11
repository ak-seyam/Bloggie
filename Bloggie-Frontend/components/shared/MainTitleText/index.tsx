import { FC, HTMLProps } from "react";
import classes from "./styles.module.scss";

interface MainTitleText extends HTMLProps<HTMLSpanElement> {
  text: string;
  markerColor?: string;
}

/**
 *
 * @param {MainTitleText} props Normal span props + the text of the title + optional
 * marker color
 *
 * **NOTE**: the styles set in props are applied only on the text
 * @returns
 */
const MainTitleText: FC<MainTitleText> = (props) => {
  return (
    <span {...props}>
      <mark
        className={classes.marker}
        style={{
          backgroundColor: props.markerColor,
        }}
      >
        {props.text}
      </mark>
    </span>
  );
};
export default MainTitleText;
