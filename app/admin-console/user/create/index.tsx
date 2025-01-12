import { useState } from "react";
import { Header } from "../../components/header";
import { Button, InputComponent } from "c4cui";
import { useConsole } from "../../ConsoleContext";

export const CreateUser = () => {
  const [password, setPassword] = useState("");
  const { organization } = useConsole();

  const handleAddMember = () => {};

  return (
    <div className="flex flex-col w-full gap-8 p-4 bg-[var(--secondary-bg-color)]">
      <Header back={true} title="Add Member" />
      <p>
        This email will be used for administrative tasks and will act as the gateway for managing your organization's
        domain settings.
      </p>
      <form onSubmit={handleAddMember} className="flex flex-col gap-8 max-w-4xl">
        <div className="flex gap-2">
          <InputComponent placeholder="First Name" name="first_name" />
          <InputComponent placeholder="Last Name" name="last_name" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-end">
            <InputComponent type="username" name="username" placeholder="Username" />
            <InputComponent
              type="select"
              name="domain"
              options={organization?.domains.map((domain, index) => ({
                id: domain.name || index.toString(),
                value: "@" + domain.name,
              }))}
            />
          </div>
          <p className="opacity-70 text-sm md:text-base">
            Your username will be paired with your domain (e.g., username@code4code.dev) to create your organization
            email.
          </p>
        </div>
        <InputComponent
          value={password}
          onChange={setPassword}
          name="password"
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
        <Button type="submit" label="Add Member" className="ml-auto" />
      </form>
    </div>
  );
};
