import { ReactNode } from "react";

type ColorType = "violet" | "rose" | "emerald" | "sky" | "black";

type Props = {
  /** Background color of the button */
  color: ColorType;
  /** Text of the button */
  label?: string;
  /** Icon contained within the button */
  icon?: ReactNode;
  /** onClick event of the button */
  onClick?: () => void;
  /** Whether the button should only be an outline or not */
  outline?: boolean;
};

const Button = ({ color, label, icon, onClick, outline }: Props) => {
  return (
    <button
      onClick={onClick}
      className={`flex min-w-[100px] items-center justify-center rounded-full px-4 py-2 text-sm font-bold transition hover:scale-105 focus-visible:ring-2 md:text-base 
      ${color === "violet" && "bg-violet-300 ring-violet-400 hover:ring-2"}
      ${color === "rose" && "bg-rose-300 ring-rose-400 hover:ring-2"}
      ${color === "emerald" && "bg-emerald-300 ring-emerald-400 hover:ring-2"}
      ${color === "sky" && "bg-sky-300 ring-sky-400 hover:ring-2"}
      ${color === "black" && !outline && "bg-black text-white ring-white"}
      ${outline && "bg-none"}
      ${outline && color === "black" && "border-4 border-black ring-white"}
      ${!label && icon && "h-12 w-12 min-w-0"}
      `}
    >
      {label && <span className={icon ? "mr-2" : ""}>{label}</span>}
      <span>{icon}</span>
    </button>
  );
};

export default Button;
