import { Domain } from "@/app/interface";
import { Button, InputComponent } from "c4cui";
import { useState } from "react";

export const UserForm = ({
  user,
  setUser,
  domains,
  handleSubmit,
}: {
  user?: {
    username: string;
    first_name: string;
    last_name?: string;
    password: string;
    phone_number?: string;
    organization?: number;
  };
  setUser?: (user: {
    username: string;
    first_name: string;
    last_name?: string;
    password: string;
    phone_number?: string;
    organization?: number;
  }) => void;
  domains: Partial<Domain>[];
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) => {
  const [selectedDomain, setSelectedDomain] = useState(domains[0]?.name || "");
  const [username, setUsername] = useState("");

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-4xl">
      <div className="flex gap-2">
        <InputComponent
          placeholder="First Name"
          name="first_name"
          value={user?.first_name}
          onChange={(e) => user && setUser && setUser({ ...user, first_name: e })}
        />
        <InputComponent
          required={false}
          placeholder="Last Name"
          name="last_name"
          value={user?.last_name}
          onChange={(e) => user && setUser && setUser({ ...user, last_name: e })}
        />
      </div>
      <div className="flex gap-2">
        <InputComponent
          type="username"
          name="username"
          placeholder="Username"
          onChange={(e) => {
            setUsername(e);
            user && setUser && setUser({ ...user, username: e + selectedDomain });
          }}
        />
        <InputComponent
          type="select"
          name="domain"
          value={selectedDomain}
          options={domains.map((domain, index) => ({
            id: domain.name || index.toString(),
            value: "@" + domain.name,
          }))}
          onChange={(e) => {
            setSelectedDomain(e);
            user && setUser && setUser({ ...user, username: username + e });
          }}
        />
      </div>
      <InputComponent
        value={user?.password}
        onChange={(e) => user && setUser && setUser({ ...user, password: e })}
        placeholder="Password"
        minLength={8}
        type="password"
        generatePassword={true}
        copyPassword={true}
      />
      <div className="flex gap-2 items-center w-auto">
        <input type="checkbox" />
        <p className="flex w-full">Force member to change password when they login.</p>
      </div>
      <Button type="submit" label="Add User" className="ml-auto" />
    </form>
  );
};
