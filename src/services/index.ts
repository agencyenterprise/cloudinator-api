import * as sendgrid from "./sendgrid";
import * as openAi from "./openAi";
import * as vercel from "./vercel";
import * as postHog from "./postHog";

interface Services {
  [key: string]: any;
}

export default {
  sendgrid,
  openAi,
  vercel,
  postHog,
} as Services;
