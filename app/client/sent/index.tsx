"use client";
import { Button, Header } from "c4cui";
import { useGlobalContext } from "../GlobalContext";
import { MailList } from "../inbox/components/mail_list";
import { useEffect } from "react";
import { formatDateRegionally } from "../utils";
import { PiArchive, PiStar, PiTrash } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

export default function Sent() {
  const { sent, handleGetSent } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    handleGetSent();
  }, []);

  return (
    <div className="flex flex-col gap-8 rounded-xl grow p-4 overflow-y-auto">
      <Header title="Sent" />
      {sent && (
        <div className="h-full overflow-y-scroll bg-[var(--mail-list-bg-color)] rounded-xl border border-[var(--mail-list-border-color)] overflow-hidden w-full">
          <table>
            <tbody>
              {sent.length > 0 ? (
                sent.map((mail) => (
                  <tr
                    key={mail.id}
                    onClick={() => mail.id && navigate(`/mail/sent/${btoa(mail.id.toString())}`)}
                    className="cursor-pointer border-[var(--mail-tile-border-color)] border-b hover:bg-[var(--mail-tile-hover-bg-color)]"
                  >
                    <td className="p-4" style={{ width: "10%" }}>
                      <div className="flex flex-col gap-2">
                        <p className="overflow-ellipsis">{mail.subject || "No subject"}</p>
                      </div>
                    </td>
                    <td className="p-4" style={{ width: "60%" }}>
                      <div className="flex flex-col gap-2">
                        <p className="overflow-ellipsis line-clamp-2">{mail.body}</p>
                      </div>
                    </td>
                    <td className="p-4" style={{ width: "10%" }}>
                      <div className="flex flex-col gap-2">
                        <p className="overflow-ellipsis line-clamp-2 text-xs whitespace-nowrap">
                          {!mail.is_draft && mail.sent_at
                            ? formatDateRegionally(mail.sent_at)
                            : mail.created_at
                            ? formatDateRegionally(mail.created_at)
                            : null}
                        </p>
                      </div>
                    </td>
                    <td className="p-4" style={{ width: "10%" }}>
                      <div className="flex gap-2 items-center">
                        <Button className="p-2 border-none" outline={true} icon={<PiStar size={18} />} />
                        <Button className="p-2 border-none" outline={true} icon={<PiTrash size={18} />} />
                        <Button className="p-2 border-none" outline={true} icon={<PiArchive size={18} />} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-4">You have no mail.</td>
                </tr>
              )}
              {/* {!viewMore ? (
            <>
              {fetchingTrips && (
                <tr id="load-more">
                  <td className="p-4">Loading more trips...</td>
                </tr>
              )}
            </>
          ) : (
            <tr>
              <Link to="/trips" className="p-4 hover:underline">
                View more...
              </Link>
            </tr>
          )} */}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
