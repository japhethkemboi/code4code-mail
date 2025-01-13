"use client";
import { useConsole } from "../ConsoleContext";
import { useNavigate } from "react-router-dom";

export default function Domains() {
  const { organization } = useConsole();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8 p-4 w-full h-full overflow-y-auto">
      <div className="flex justify-between p-4 rounded-xl border border-black/20 w-full">
        <h2 className="text-lg">Domains</h2>
      </div>
      <div className="flex flex-col gap-4 bg-[var(--mail-list-bg-color)] rounded-xl border border-[var(--mail-list-border-color)] overflow-hidden w-full">
        <table>
          <tbody>
            {organization?.domains && organization?.domains?.length > 0
              ? organization.domains.map((domain) => (
                  <tr
                    key={domain.name}
                    onClick={() => navigate(`/domains/${domain.name}`)}
                    className="cursor-pointer border-[var(--mail-tile-border-color)] border-b hover:bg-[var(--mail-tile-hover-bg-color)]"
                  >
                    <td className="p-4">{domain.name}</td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
