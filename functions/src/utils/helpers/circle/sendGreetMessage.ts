import { db } from "../../../configs/firebase";
import { createChat, getMemberToken, sendMessage } from "../../../lib/circle";

type SendWelcomeMessage = (
  memberId: number,
  memberName: string,
  productType: string,
) => Promise<void>;

export const sendWelcomeMessage: SendWelcomeMessage = async (memberId, memberName, productType) => {
  const moderatorDoc = await db.collection("circle_admins").doc("Moderator").get();

  const moderatorEmail = moderatorDoc.data()?.email;
  const moderatorName = moderatorDoc.data()?.name || "CM";

  const text = `Hey ${memberName}! Welcome to the Protocol. I’m ${moderatorName}. Start with ‘Start Here’ — Lily has a welcome message for you. When you’re ready to submit homework, send it to me right here in DM. And please fill out the Report Data Form by Day 7 — this is how we know which reports to calculate for you!`;

  if (moderatorEmail) {
    const res = await getMemberToken(moderatorEmail);
    if (res) {
      const chatRes = await createChat(memberId, res.access_token, productType);

      if (chatRes) {
        await sendMessage(chatRes.chat_room.uuid, text, res.access_token);
      }
    }
  }
};
