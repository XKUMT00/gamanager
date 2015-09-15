module gamanager {
	export class WebProperty {
		
		private PROFILES: util.StringMap<Profile> = new util.StringMap<Profile>();
		
		constructor(
			private gam: GAManager,
			private id: string,
			private name: string,
			private internalId: string,
			private level: string,
			private accountId: string,
			profiles: Array<ParcialProfile>
		){
			for(var i: number = 0; i < profiles.length;i++){
				this.PROFILES.put(
					profiles[i].id, 
					new Profile(
						this.gam,
						profiles[i].id,
						profiles[i].name,
						profiles[i].type,
						this.accountId,
						this.id
					)
				);
			}
		}
	}
}