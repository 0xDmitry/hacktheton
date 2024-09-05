import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/intruder_level_factory.tact',
    options: {
        debug: true,
    },
};
