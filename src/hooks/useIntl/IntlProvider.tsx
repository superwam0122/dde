import IntlContext from "./IntlContext";

import type { ReactNode } from "react";
import type { IntlConfig } from ".";

type Props = IntlConfig & {
  children: ReactNode;
};

export default function IntlProvider({ children, ...props }: Props) {
  return <IntlContext.Provider value={props}>{children}</IntlContext.Provider>;
}
