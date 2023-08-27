import type { ArrayString } from '@skyra/env-utilities';

declare module '@skyra/env-utilities' {
	export interface Env {
		DISCORD_TOKEN: string;
		OWNERS: ArrayString;
		API_KEY: string;
	}
}
