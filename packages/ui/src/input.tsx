import * as React from "react";
import * as stylex from "@stylexjs/stylex";
import { colors, space, radius } from "./tokens.stylex";

const styles = stylex.create({
  input: {
    boxSizing: "border-box",
    width: "100%",
    paddingBlock: space.sm,
    paddingInline: space.md,
    fontSize: "0.95rem",
    fontFamily: "inherit",
    color: colors.fg,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: {
      default: colors.border,
      ":focus": colors.borderFocus,
    },
    borderRadius: radius.md,
    outline: "none",
    "::placeholder": {
      color: colors.muted,
    },
  },
});

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input(props: InputProps) {
  return <input {...props} {...stylex.props(styles.input)} />;
}
