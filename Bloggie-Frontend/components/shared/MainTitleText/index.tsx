import { FC, HTMLProps } from "react";
import classes from "./styles.module.scss";

interface MainTitleTextProps extends HTMLProps<HTMLSpanElement> {
  text: string;
  markerColor?: string;
}

/**
 *
 * @param props Normal span props + the text of the title + optional
 * marker color
 *
 * **NOTE**: the styles set in props are applied only on the text
 * @returns
 */
const MainTitleText: FC<MainTitleTextProps> = (props: MainTitleTextProps) => {
	const {text, markerColor, ...htmlProps} = props;
  return (
    <span
      {...htmlProps}
      style={{
        fontWeight: "bolder",
        textTransform: "capitalize",
        ...htmlProps.style,
      }}
    >
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
