"use client";

import { BiCopy } from "react-icons/bi";
import { useAuth } from "../../auth/AuthProvider";
import { copyToClipboard } from "@/app/utils";
import { PiPlus } from "react-icons/pi";
import { Header } from "../components/header";
import { Button } from "c4cui";
import { useConsole } from "../ConsoleContext";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const navigate = useNavigate();
  const { users } = useConsole();

  return (
    <div className="flex flex-col gap-8 w-full bg-[var(--secondary-bg-color)] p-4 overflow-y-auto">
      <Header title="Users">
        <Button
          className="px-4 p-2 rounded-full border-none"
          outline={true}
          onClick={() => navigate("/console/users/add/")}
          icon={<PiPlus size={18} />}
          label="Add user"
        />
      </Header>
      <div className="flex flex-wrap gap-4">
        {users &&
          users?.map((user) => (
            <div key={user.username} className="flex gap-4">
              <div className="flex size-20 items-center justify-center text-5xl font-extralight p-4 rounded-full bg-[var(--primary-color)] text-[var(--bg-color)]">
                {user.first_name?.[0]?.toUpperCase() || ""}
                {user.last_name?.[0]?.toUpperCase() || ""}
              </div>
              <div className="flex flex-col gap-1 justify-center">
                <p className="text-lg flex items-center gap-2">{user.first_name + " " + user.last_name}</p>
                <p className="text-sm">{user.role}</p>
                <p
                  onClick={() => copyToClipboard(user.username || "")}
                  className="hover:underline flex items-center gap-2 cursor-pointer"
                >
                  {user.username}
                  <BiCopy size={14} />
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
