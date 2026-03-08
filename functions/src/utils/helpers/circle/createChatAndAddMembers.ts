import { addCMToSpace, addMemberToSpace, createSpace } from "../../../lib/circle";

export const createChatAndAddMembers = async (name: string, email: string) => {
  const chat_id = await createSpace(name, "chat", "1010467");

  if (!chat_id) return;

  await addMemberToSpace(email, chat_id);
  await addCMToSpace(chat_id);
};
