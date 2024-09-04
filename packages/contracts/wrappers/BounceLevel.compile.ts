import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/bounce_level.tact',
    options: {
        debug: true,
    },
};
