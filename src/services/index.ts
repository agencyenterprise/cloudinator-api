import * as sendGrid from './sendgrid';
import * as openAi from './openAi';

interface Services {
  [key: string]: any;
}

export default {
  sendGrid,
  openAi
} as Services;