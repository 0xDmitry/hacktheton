import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/leaderboard.tact',
    options: {
        debug: true,
    },
};
