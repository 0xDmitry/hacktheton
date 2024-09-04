import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/player_stats.tact',
    options: {
        debug: true,
    },
};
