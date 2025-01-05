import { toast } from "react-toastify";

export const copyToClipboard = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast.info("Copied to clipboard.");
    })
    .catch((err) => {
      toast.info("Failde to copy to clipboard.");
    });
};
