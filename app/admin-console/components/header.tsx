import { Button } from "c4cui";
import { ReactNode } from "react";
import { GoChevronLeft } from "react-icons/go";
import { To } from "react-router-dom";

export const Header = ({ title, back, children }: { title: string; back?: boolean; children?: ReactNode }) => {
  return (
    <div className="flex justify-between items-center p-4 rounded-xl border border-black/20 w-full">
      <div className="flex gap-4 items-center">
        {back && <Button type="nav-button" link={-1 as To} icon={<GoChevronLeft size={18} />} className="p-2" />}
        <h2 className="text-lg">{title}</h2>
      </div>
      <div className="flex gap-4 items-center">{children}</div>
    </div>
  );
};
