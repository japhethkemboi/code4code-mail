"use client";

import { BiCopy } from "react-icons/bi";
import { useAuth } from "../../auth/AuthProvider";
import { useGlobalContext } from "../GlobalContext";
import { copyToClipboard } from "@/app/utils";
import { PiPlus } from "react-icons/pi";
import { Button } from "@/app/components/button";
import { Header } from "../components/header";

export default function Users() {
  const { user } = useAuth();
  const { organization, organizationMembers } = useGlobalContext();

  return (
    <div className="flex flex-col gap-8 w-full bg-[var(--secondary-bg-color)] p-4 overflow-y-auto">
      <Header title="Users">
        <Button
          className="px-4 p-2 rounded-full"
          outline={true}
          link="/console/organization/user/add/"
          icon={<PiPlus size={18} />}
          label="Add user"
        />
      </Header>
      <div className="flex flex-wrap gap-4">
        {organizationMembers &&
          organizationMembers?.map((member) => (
            <div key={member.username} className="flex gap-4">
              <div className="flex size-20 items-center justify-center text-5xl font-extralight p-4 rounded-full bg-teal-400">
                {member.first_name?.[0]?.toUpperCase() || ""}
                {member.last_name?.[0]?.toUpperCase() || ""}
              </div>
              <div className="flex flex-col gap-1 justify-center">
                <p className="text-lg flex items-center gap-2">
                  {member.first_name + " " + member.last_name}
                  <span className="text-xs p-2 rounded-full text-green-50 bg-green-500">Online</span>
                </p>
                <p className="text-sm">{member.role}</p>
                <p
                  onClick={() => copyToClipboard(member.username || "")}
                  className="hover:underline flex items-center gap-2 cursor-pointer"
                >
                  {member.username}
                  <BiCopy size={14} />
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
