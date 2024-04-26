import * as sendgrid from "./sendgrid";
import * as openAi from "./openAi";
import * as vercel from "./vercel";
import * as postHog from "./postHog";
import * as gemini from "./gemini";
import * as loops from "./loops";
import * as amplitude from "./amplitude";

interface Services {
  [key: string]: any;
}

export default {
  sendgrid,
  openAi,
  vercel,
  postHog,
  gemini,
  loops,
  amplitude,
} as Services;
