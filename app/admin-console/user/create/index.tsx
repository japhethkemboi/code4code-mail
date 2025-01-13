import { useState } from "react";
import { Header } from "../../components/header";
import { useConsole } from "../../ConsoleContext";
import { useAuth } from "@/app/auth/AuthProvider";
import { toast } from "react-toastify";
import { UserForm } from "./UserForm";

export const CreateUser = () => {
  const [newUser, setNewUser] = useState<{
    username: string;
    first_name: string;
    last_name?: string;
    password: string;
    phone_number?: string;
    organization?: number;
  }>({
    username: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    password: "",
  });
  const { signup } = useAuth();
  const { organization } = useConsole();

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await signup({ ...newUser, organization: organization?.id });
    if (res.profile) {
      toast.success(`${res.profile.first_name} added to your organization.`);
    } else {
      toast.error(res.error || "Error while adding user.");
    }
  };

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto gap-8 p-4 bg-[var(--secondary-bg-color)]">
      <Header back={true} title="Add User" />
      <p>Users can use this email to get emails, verification codes and other mail related functions.</p>
      <UserForm
        handleSubmit={handleAddUser}
        domains={organization?.domains || []}
        user={newUser}
        setUser={setNewUser}
      />
    </div>
  );
};
