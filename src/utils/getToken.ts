import { AxiosInstance } from "axios";

export const getNHToken = async (
  session: AxiosInstance,
): Promise<{
  sessionToken: string;
  token: string;
}> => {
  await session.get("https://banking.nonghyup.com/nhbank.html");
  const response = await session.post("https://banking.nonghyup.com/servlet/IPMS0011I.view");

  const sessionTokenMatch = response.data.match(/window\["SESSION_TOKEN"\]\s+=\s+'(.+?)'/);
  const sessionToken = sessionTokenMatch ? sessionTokenMatch[1] : "";

  const tokenMatch = response.data.match(/window\["TOKEN"\]\s+=\s+'(.+?)'/);
  const token = tokenMatch ? tokenMatch[1] : "";

  return {
    sessionToken,
    token,
  };
};
