import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/swap_level.tact',
    options: {
        debug: true,
    },
};
