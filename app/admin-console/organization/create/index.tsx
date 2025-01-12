import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Organization, organizationTypes, Profile } from "@/app/interface";
import { useAuth } from "@/app/auth/AuthProvider";
import { useConsole } from "../../ConsoleContext";
import { Button, InputComponent } from "c4cui";
import { DomainVerify } from "../../domain/verify";

export default function CreateOrganization() {
  const { step } = useParams();
  const { signup, login } = useAuth();
  const [newOrganization, setNewOrganization] = useState<Organization>({
    name: "",
    domains: [],
    organization_type: "",
  });
  const [complete, setComplete] = useState(false);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();
  const { verifyDomain, getOrganization, createOrganization } = useConsole();

  useEffect(() => {
    const id = parseInt(localStorage.getItem("organization") || "");
    if (id > 0) handleGetOrganization(id);
  }, []);

  useEffect(() => {
    if (complete && !localStorage.getItem("organization")) {
      navigate("/organization/create/3");
    } else if (localStorage.getItem("organization") && verified) {
      navigate("/organization/create/2");
    } else if (localStorage.getItem("organization")) {
      navigate("/organization/create/1");
    } else {
      navigate("/organization/create/0");
    }
  }, [step, verified]);

  const handleGetOrganization = async (id: number) => {
    const res = await getOrganization(id);
    if (res.organization) {
      setNewOrganization(res.organization);
    } else {
      localStorage.removeItem("organization");
      navigate("/organization/create/0");
      toast.error(res.error || "Error while trying to load your information.");
    }
  };

  const handleVerify = async (domain: string) => {
    const res = await verifyDomain(domain);
    if (res.ok) {
      setVerified(true);
      navigate("/organization/create/2");
      toast.success("Domain verified successfully!");
    } else {
      toast.error(res.error || "Verification failed. Token not found in DNS.");
    }
  };

  const handleCreateOrganization = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newOrganization.domains && newOrganization.domains.length > 0) {
      let url = newOrganization.domains[0].name || "";

      // Normalize the domain to domain.ext
      try {
        // Remove protocol and www.
        const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
        url = urlObj.hostname.replace(/^www\./, "");

        // Extract the root domain (e.g., domain.ext)
        const domainParts = url.split(".");
        if (domainParts.length === 2) {
          url = domainParts.slice(-2).join(".");
          const res = await createOrganization({
            ...newOrganization,
            domains: [{ name: url }],
          });

          if (res.organization) {
            setNewOrganization(res.organization);
            res.organization.id && localStorage.setItem("organization", res.organization.id?.toString());
            navigate("/organization/create/1");
          } else {
            toast.error(res.error || "Error creating domain.");
          }
        } else {
          toast.error("Invalid domain format. Please enter a valid domain. eg code4code.dev");
        }
      } catch (error) {
        toast.error("Invalid domain format. Please use a valid domain.");
      }
    } else {
      toast.error("Domain is required.");
    }
  };

  const handleCreateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formObj: Record<string, string> = {};

    Array.from(formData.entries()).forEach(([key, value]) => {
      formObj[key] = value.toString().trim();
    });

    if (!formObj["first_name"]) {
      toast.error("Please enter first name");
    } else if (!formObj["last_name"]) {
      toast.error("Please enter last name");
    } else if (!formObj["username"] || /[^\w.-]/.test(formObj["username"])) {
      toast.error("Please enter a valid username. It should only contain letters, numbers, periods and hyphens.");
    } else if (!formObj["password"] || formObj["password"].length < 8) {
      toast.error("Password should be atleast 8 characters long.");
    } else {
      const res = await signup({
        ...formObj,
        username: `${formObj["username"]}@${newOrganization?.domains[0].name}`,
        organization: newOrganization?.id?.toString(),
      } as Profile);
      if (res.profile) {
        toast.success("Account created successfully.");
        const loginRes = await login({
          username: `${formObj["username"]}@${newOrganization?.domains[0].name}`,
          password: `${formObj["password"]}`,
        });
        if (loginRes.ok) {
          navigate("/console/");
        } else {
          navigate("/organization/create/3");
        }
        setComplete(true);
        localStorage.removeItem("organization");
      } else {
        toast.error(res.error || "Error while creating your account.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 items-center justify-center w-screen h-screen overflow-y-scroll">
      {!step || step === "0" ? (
        <form onSubmit={handleCreateOrganization} className="flex flex-col gap-8 max-w-4xl w-full self-center p-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl">Organization</h2>
          <InputComponent
            placeholder="Organization Name"
            name="name"
            value={newOrganization?.name || ""}
            onChange={(e) => setNewOrganization({ ...newOrganization, name: e })}
          />
          <InputComponent
            placeholder="Organization Type"
            name="organization_type"
            type="select"
            options={[{ id: "", value: "Type of Organization", selected: true, disabled: true }, ...organizationTypes]}
            onChange={(e) => setNewOrganization({ ...newOrganization, organization_type: e })}
          />
          <InputComponent
            placeholder="Domain"
            name="domain"
            value={newOrganization?.domains[0]?.name || ""}
            onChange={(e) => setNewOrganization({ ...newOrganization, domains: [{ name: e }] })}
          />
          <Button type="submit" label="Next" className="ml-auto" />
        </form>
      ) : null}
      {step === "1" && (
        <DomainVerify
          domain={newOrganization.domains[0]}
          handleVerify={handleVerify}
          onGoBack={() => {
            localStorage.removeItem("organization");
            navigate("/organization/create/0");
          }}
          onEditDomain={() => {
            localStorage.removeItem("organization");
            setComplete(false);
            navigate("/organization/create/0");
          }}
        />
      )}
      {step === "2" && (
        <form onSubmit={handleCreateAccount} className="flex flex-col gap-8 max-w-4xl self-center p-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl">Create primary email</h2>
          <p>
            This email will serve as the core account for managing all your domain users and settings. It will be the
            primary point of contact for your organization's email communications, allowing you to:
          </p>
          <ul className="flex flex-col gap-2 text-sm">
            <li>Manage Users: Create and manage user accounts associated with your domain.</li>
            <li>
              Set Up Email Rules: Configure email forwarding, security protocols, and other essential email settings.
            </li>
            <li>
              Control Permissions: Assign roles, access levels, and manage domain-wide privileges for other users.
            </li>
          </ul>
          <p>
            This email will be used for administrative tasks and will act as the gateway for managing your
            organization's domain settings.
          </p>
          <div className="flex gap-2">
            <InputComponent placeholder="First Name" name="first_name" />
            <InputComponent placeholder="Last Name" name="last_name" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-end">
              <InputComponent type="username" name="username" placeholder="Username" />
              <p className="flex w-full">@{newOrganization?.domains[0]?.name || ""}</p>
            </div>
            <p className="opacity-70 text-xs md:text-sm">
              Your username will be paired with your domain (e.g., username@code4code.dev) to create your organization
              email.
            </p>
          </div>
          <InputComponent
            generatePassword={true}
            copyPassword={true}
            name="password"
            placeholder="Password"
            minLength={8}
            type="password"
          />
          <Button type="submit" label="Create account" className="ml-auto" />
        </form>
      )}
      {step === "3" && complete && (
        <div className="flex flex-col gap-8 max-w-4xl self-center p-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl">Welcome to the family!</h2>
          <p>Login to access </p>
          <Button label="Login" />
        </div>
      )}
    </div>
  );
}
