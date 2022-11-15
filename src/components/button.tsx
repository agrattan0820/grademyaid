import { ReactNode } from "react";

type ColorType = "violet" | "rose" | "emerald";

type Props = {
  /** Background color of the button */
  color: ColorType;
  /** Text of the button */
  label: string;
  /** Icon contained within the button */
  icon?: ReactNode;
  /** onClick event of the button */
  onClick?: () => void;
};

const Button = ({ color, label, icon, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center rounded-full px-4 py-2 font-bold ring-emerald-100 transition hover:ring-2 focus-visible:ring-2 
      ${color === "violet" && "bg-violet-300"}
      ${color === "rose" && "bg-rose-300"}
      ${color === "emerald" && "bg-emerald-300"}
      `}
    >
      <span className={icon ? "mr-2" : ""}>{label}</span> <span>{icon}</span>
    </button>
  );
};

export default Button;
