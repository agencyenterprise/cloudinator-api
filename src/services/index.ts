import * as sendGrid from './sendgrid';
import * as openAi from './openAi';
import * as vercel from './vercel';

interface Services {
  [key: string]: any;
}

export default {
  sendGrid,
  openAi,
  vercel,
} as Services;