import * as sendgrid from "./sendgrid";
import * as openAi from "./openAi";
import * as vercel from "./vercel";
import * as postHog from "./postHog";
import * as gemini from "./gemini";

interface Services {
  [key: string]: any;
}

export default {
  sendgrid,
  openAi,
  vercel,
  postHog,
  gemini,
} as Services;
