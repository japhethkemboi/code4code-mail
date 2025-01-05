"use client";

import { BiCopy, BiCrown } from "react-icons/bi";
import { useAuth } from "../../auth/AuthProvider";
import { useGlobalContext } from "../GlobalContext";
import { copyToClipboard } from "@/app/utils";

export default function Organization() {
  const { user } = useAuth();
  const { organization } = useGlobalContext();

  return (
    <div className="flex flex-col gap-8 p-4 w-full">
      <div className="flex justify-between p-4 rounded-xl border border-black/20 w-full">
        <h2 className="text-lg">Organization</h2>
      </div>
      <div className="flex gap-4">
        <div className="flex size-24 items-center justify-center text-5xl font-extralight p-4 rounded-xl bg-teal-400"></div>
        <div className="flex flex-col gap-2 justify-center">
          <h2 className="text-lg">{organization?.name}</h2>
          {organization?.domains.map((domain) => (
            <a
              key={domain.name}
              href={"https://" + domain.name}
              target="__blank"
              className="font-extralight opacity-70 text-sm hover:underline hover:text-[var(--hovered-link)]"
            >
              {domain.name}
            </a>
          ))}
        </div>
      </div>
      <h2 className="text-lg">Owner</h2>
      <div className="flex gap-4">
        <div className="flex size-20 items-center justify-center text-5xl font-extralight p-4 rounded-full bg-teal-400"></div>
        <div className="flex flex-col gap-2 justify-center">
          <p className="text-lg">{organization?.owner?.first_name + " " + organization?.owner?.last_name}</p>
          <p
            onClick={() => copyToClipboard(organization?.owner?.username || "")}
            className="hover:underline flex items-center gap-2 cursor-pointer"
          >
            {organization?.owner?.username}
            <BiCopy size={14} />
          </p>
        </div>
      </div>
      <h2 className="text-lg">Email Templates</h2>
      <div className="flex gap-4">
        <div className="flex w-40 h-60 items-center justify-center text-5xl font-extralight p-4 rounded-xl bg-teal-400"></div>
        <div className="flex w-40 h-60 items-center justify-center text-5xl font-extralight p-4 rounded-xl bg-teal-400"></div>
        <div className="flex w-40 h-60 items-center justify-center text-5xl font-extralight p-4 rounded-xl bg-teal-400"></div>
      </div>
      <h2 className="text-lg">Plan</h2>
      <div className="flex flex-col gap-4 rounded-xl border p-4 bg-black text-white">
        <p className="text-lg flex gap-2 items-center">
          Premium <BiCrown />
        </p>
        <p className="">Since 27th Nov 2024</p>
        <p className=" flex items-center gap-2">
          Status: <span className="text-xs p-2 rounded-full bg-blue-500 text-blue-50">Active</span>
        </p>
      </div>
    </div>
  );
}
