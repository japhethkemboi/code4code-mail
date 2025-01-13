import { copyToClipboard } from "@/app/utils";
import { useState } from "react";
import { BiCopy, BiPencil } from "react-icons/bi";
import { Domain } from "@/app/interface";
import crypto from "crypto";
import { Button, InputComponent } from "c4cui";

export const DomainVerify = ({
  domain,
  handleVerify,
  onEditDomain,
  onGoBack,
}: {
  domain: Partial<Domain>;
  handleVerify: (domain: string) => void;
  onEditDomain?: () => void;
  onGoBack?: () => void;
}) => {
  const [method, setMethod] = useState("0");

  return (
    <div className="flex flex-col h-full gap-8 max-w-4xl self-center p-4">
      <h2 className="text-2xl md:text-3xl">Verfy ownership</h2>
      <div className="flex gap-2 items-center">
        <p>{domain?.name}</p>
        <Button onClick={onEditDomain} icon={<BiPencil size={18} />} outline={true} className="border-none" />
      </div>
      <p>
        We need to verify your ownership of {domain?.name || ""}. This is a simple step, and it won’t interfere with
        your current email or domain management services. You can verify ownership using one of the methods below.
      </p>
      <InputComponent
        type="select"
        name="method"
        onChange={setMethod}
        value={method}
        options={[
          { id: "0", value: "Add TXT record in the DNS (Recomended)" },
          { id: "1", value: "Add CNAME record in the DNS" },
        ]}
      />
      {method && (
        <div className="flex flex-col gap-4 p-4 border rounded">
          <h3>Procedure</h3>
          <p>
            1. Log in to your domain registrar (e.g., Namecheap, GoDaddy, Cloudflare) or wherever you manage your DNS
            settings.
          </p>
          <p>
            2. Navigate to the DNS Management or Advanced DNS section. This is where you can view and manage your DNS
            records.
          </p>
          <p>
            3. Add a new {method === "0" ? "TXT" : "CNAME"} record, and paste the below{" "}
            {method === "0" ? "TXT" : "CNAME"} value into the DNS configuration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 rounded-xl border p-4">
            <div className="flex flex-col gap-2">
              <p className="opacity-70 text-sm">Host</p>
              <p className="flex gap-2 items-center hover:underline cursor-pointer">
                {method === "0" ? "@" : "verify"}
              </p>
            </div>
            <div className="flex flex-col gap-2 overflow-hidden shrink-0 grow">
              <p className="opacity-70 text-sm">{method === "0" ? "TXT" : "CNAME"} Value</p>
              <p
                onClick={() =>
                  copyToClipboard(
                    method === "0"
                      ? `${crypto
                          .createHash("sha256")
                          .update(domain?.name || "")
                          .digest("hex")
                          .substring(0, 10)}.code4code.dev`
                      : "code4code.dev."
                  )
                }
                className="flex gap-2 items-center hover:underline cursor-pointer text-ellipsis line-clamp-1"
              >
                {method === "0"
                  ? `${crypto
                      .createHash("sha256")
                      .update(domain?.name || "")
                      .digest("hex")
                      .substring(0, 10)}.code4code.dev`
                  : "code4code.dev."}
                <BiCopy size={18} />
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="opacity-70 text-sm">TTL</p>
              <p className="text-sm">Leave this at the default value (or set to "Automatic").</p>
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-2 ml-auto">
        {onGoBack && <Button type="button" label="Back" outline={true} onClick={onGoBack} />}
        <Button label="Verify" onClick={() => domain.name && handleVerify(domain.name)} />
      </div>
    </div>
  );
};
