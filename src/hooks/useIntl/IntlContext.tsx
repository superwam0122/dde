import { createContext } from "react";

import type { IntlConfig } from ".";

const IntlContext = createContext<IntlConfig | undefined>(undefined);

export default IntlContext;
