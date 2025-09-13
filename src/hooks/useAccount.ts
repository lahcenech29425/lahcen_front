import { UserType } from "@/types/User";
import { useState, useEffect } from "react";

export function useAccount() {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (userData && token) {
      setUser({ ...(JSON.parse(userData)), token });
    } else if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return user;
}
