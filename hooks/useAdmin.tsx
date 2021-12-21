import React from "react";
import * as R from "ramda";

import type { Session } from "next-auth";
import { useSession } from "next-auth/react";

export const equalsAdminEmail = R.pipe<[Session | null], string, boolean>(
  R.pathOr("", ["user", "email"]),
  R.cond([
    [R.isEmpty, R.always(false)],
    [
      R.pipe(R.type, R.equals("String")),
      R.pipe(
        R.toLower,
        R.equals(R.toLower(process.env.NEXT_PUBLIC_ADMIN_GITHUB_EMAIL ?? ""))
      ),
    ],
  ])
);

const useAdmin = () => {
  const [isAdmin, setAdmin] = React.useState(false);
  const [isLogin, setLogin] = React.useState(false);
  const { data: session, status } = useSession();

  React.useEffect(() => {
    if (status === "authenticated") {
      if (equalsAdminEmail(session)) {
        setAdmin(true);
        setLogin(true);
      } else {
        setAdmin(false);
        setLogin(true);
      }
    } else {
      setAdmin(false);
      setLogin(false);
    }
  }, [session, status]);

  return [isLogin, isAdmin, { session, status }] as const;
};

export default useAdmin;
