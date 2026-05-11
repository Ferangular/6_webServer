import 'dotenv/config';
import env from 'env-var';
export const envs = {
    PORT: env.get('PORT').required().asPortNumber(),
    PUBLIC_PATH: env.get('PUBLIC_PATH').default('public').asString(),
};
//# sourceMappingURL=envs.js.map