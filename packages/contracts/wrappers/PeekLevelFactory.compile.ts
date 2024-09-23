import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/peek_level_factory.tact',
    options: {
        debug: true,
    },
};
