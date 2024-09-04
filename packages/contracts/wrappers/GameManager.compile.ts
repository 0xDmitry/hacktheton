import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/game_manager.tact',
    options: {
        debug: true,
    },
};
