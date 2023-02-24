import { ButtonHTMLAttributes, ReactNode } from "react";

type ColorType = "violet" | "rose" | "emerald" | "sky" | "black";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Background color of the button */
  color: ColorType;
  /** Whether the button should only be an outline or not */
  outline?: boolean;
  /** Size of the button */
  size?: "icon" | "small" | "normal";
  /** Size of the button */
  height?: "inherit" | "full";
  /** Child node of the button */
  children: ReactNode | ReactNode[];
}

const Button = ({
  color,
  outline,
  size,
  height,
  children,
  ...props
}: Props) => {
  return (
    <button
      {...props}
      className={`flex min-w-[100px] items-center justify-center rounded-full font-bold transition focus-visible:ring-2 md:hover:scale-105 
      ${height === "full" ? "h-full" : ""}
      ${
        size === "icon"
          ? "h-12 w-12 min-w-0 px-2 py-1 text-sm"
          : size === "small"
          ? "px-2 py-1 text-sm"
          : "px-4 py-2 text-sm md:text-base"
      }
      ${color === "violet" ? "bg-violet-300 ring-violet-400 hover:ring-2" : ""}
      ${color === "rose" ? "bg-rose-300 ring-rose-400 hover:ring-2" : ""}
      ${
        color === "emerald" && !outline
          ? "bg-emerald-300 ring-emerald-400 hover:ring-2"
          : ""
      }
      ${color === "sky" ? "bg-sky-300 ring-sky-400 hover:ring-2" : ""}
      ${color === "black" && !outline ? "bg-black text-white ring-white" : ""}
      ${outline ? "bg-none" : ""}
      ${outline && color === "black" ? "border-4 border-black ring-white" : ""}
      ${
        outline && color === "emerald"
          ? "box-border border-4 border-emerald-300 ring-white"
          : ""
      }
      `}
    >
      {children}
    </button>
  );
};

export default Button;
