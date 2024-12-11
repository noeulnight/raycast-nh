import { Icon, MenuBarExtra, getPreferenceValues, showToast } from "@raycast/api";
import { useEffect, useState } from "react";
import axios from "axios";

import { getNHToken } from "./utils/getToken";
import { getBalance } from "./utils/getBalance";

interface Preferences {
  accountNumber: string;
  password: string;
  birth: string;
}

export default function Command() {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const preferences = getPreferenceValues<Preferences>();

      try {
        const session = axios.create();
        const { sessionToken, token } = await getNHToken(session);
        const { balance } = await getBalance(session, { ...preferences, sessionToken, token });

        setBalance(balance);
      } catch {
        showToast({
          title: "Failed to load balance",
          message: "Please check your account number, password, and birth.",
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <MenuBarExtra icon={Icon.Bookmark} isLoading={isLoading}>
      <MenuBarExtra.Item title="현재 잔액" />
      <MenuBarExtra.Item
        title={balance ? `${balance.toLocaleString()}원` : "잔액을 불러오는 중입니다."}
        onAction={() => {}}
      />
    </MenuBarExtra>
  );
}
