// WRITE HERE ANY HELPERS THAT REDUCE THE SIZE OF YOUR CODE BY REUSABILITY
// AND ARE USED GLOBALLY

import { ENV_PRODUCTION } from './constants.js';

const isProduction = () => process.env.NODE_ENV === ENV_PRODUCTION;

export { isProduction };
