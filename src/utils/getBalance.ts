import { AxiosInstance } from "axios";
import * as cheerio from "cheerio";
import { format, subDays } from "date-fns";

interface GetBalanceInput {
  sessionToken: string;
  token: string;
  accountNumber: string;
  password: string;
  birth: string;
}

export const getBalance = async (
  session: AxiosInstance,
  { accountNumber, password, birth, sessionToken, token }: GetBalanceInput,
) => {
  const startDate = format(subDays(new Date(), 14), "yyyyMMdd");
  const endDate = format(new Date(), "yyyyMMdd");

  const payload = {
    GjaGbn: "1",
    InqGjaNbr: accountNumber,
    GjaSctNbr: password,
    rlno1: birth,
    InqGbn_2: "2",
    InqGbn: "1",
    InqFdt: startDate,
    InqEndDat: endDate,
    InqDat: startDate,
    EndDat: endDate,
    SESSION_TOKEN: sessionToken,
    TOKEN: token,
  };

  try {
    const response = await session.post(
      "https://banking.nonghyup.com/servlet/IPMS0012R.frag",
      new URLSearchParams(payload),
      { timeout: 10000 },
    );
    const data = response.data;
    let success = true;

    if (data.includes('<div class="error">')) {
      success = false;
    }

    if (success) {
      const $ = cheerio.load(data.replace(/<br>/g, " "));
      const balance = $(".tb_row tr").eq(1).find("td").eq(1).text().trim();
      return {
        success: true,
        balance: ((text: string): number => {
          text = text.replace(/\D/g, "");
          return text ? parseInt(text) : 0;
        })(balance),
      };
    }

    return {
      success: false,
      balance: 0,
    };
  } catch (error) {
    return {
      success: false,
      balance: 0,
    };
  }
};
