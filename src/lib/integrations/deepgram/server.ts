import "server-only";
import { DeepgramClient } from "@deepgram/sdk";

import { serverEnv } from "@/lib/env.server";

export const deepgram = new DeepgramClient({ apiKey: serverEnv.DEEPGRAM_API_KEY });
