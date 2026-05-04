import { useContext } from "react";
import { MessageContext } from "../contexts/MessageContext";

export const useMessageInfo = () => {
  return useContext(MessageContext);
};
