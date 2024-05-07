import * as sendgrid from "./sendgrid";
import * as openAi from "./openAi";
import * as vercel from "./vercel";
import * as postHog from "./postHog";
import * as gemini from "./gemini";
import * as loops from "./loops";
import * as amplitude from "./amplitude";
import * as simpleAnalytics from "./simpleAnalytics";
import * as clerk from "./clerk";
import * as railway from "./railway";
import * as mux from "./mux";

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
  simpleAnalytics,
  clerk,
  railway,
  mux,
} as Services;
