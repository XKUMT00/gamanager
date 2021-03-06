///<reference path="../../reference.ts" />
module gamanager {
	export class AccountManager {
		
		//Account storage
		private ACCOUNTS: util.StringMap<Account> = new util.StringMap<Account>();
		
		constructor(private appM: AppManager, private $log){
			
		}
		
		
		/********************************************************************
		 * Factory method for creating accounts
		 */
		private createAccount(account: ParcialAccount){
			this.ACCOUNTS.put(
					account.id, 
					new Account( 
						account.id, 
						account.name, 
						account.webProperties
					)
			);
		}
		
		
		/**********************************************************************
		 * Returns map of all accounts
		 */
		public getAllAccounts(): util.StringMap<Account>{
			return this.ACCOUNTS;
		}
		
		
		/***********************************************************************
		 * Returns account by its number.
		 */
		public getAccount(accountId: string):Account{
			return this.ACCOUNTS.get(accountId);
		}
		
		
		/************************************************************************
		 * Request API for AccounSummaries. Basic data about Account, WebProperties and Profiles.
		 */
		public requestAccountSummaries(input: any): Promises.Promise{
			this.$log.debug('AccountManager: Starting AccountSummaries request.');
			
			var d = new Promises.Deferred();
			 
			if(gapi.client.analytics){
				gapi.client.analytics.management.accountSummaries.list()
					.then(
						(param) => {
							this.$log.debug('AccountManager: Fullfilling AccountSummaries request.');
							d.fulfill(param);
						},
						(error) => {
							this.$log.error('AccountManager: Rejecting AccountSummaries request.');
							d.reject(Strings.ERROR_ANALYTICS_NOT_FOUND);
						}
					);		
			}
			else {
				this.$log.error('AccountManager: Rejecting AccountSummaries request. NEVER SHOULD HAPEN!');
				d.reject(Strings.ERROR_ANALYTICS_NOT_RESPONSE);
			}
			
			this.$log.debug('AccountManager: Returning AccountSummaries request promise.');
			return d.promise();
		}
		
		
		/********************************************************************************
		 * Proiteruje data v parametru a vytvoří jednotlivé instance všech ÚČTŮ, PROPERTY A PROFILŮ. Parametr by mě odpovídat tomu co vrátí APi na základě metody requestAccountSUmmaries()
		 */
		public saveAccountSummaries(data): Promises.Promise{
			this.$log.debug('AccountManager: Starting save accountsummaries info.');
			var accounts: Array<ParcialAccount> = data.result.items,
				d = new Promises.Deferred;
			
			for(var i:number = 0; i<accounts.length; i++){
				this.createAccount(accounts[i]);
			}
			
			if(this.ACCOUNTS.getSize() == accounts.length){
				this.$log.debug('AccountManager: Fillfiling save accountsummaries info.');
				d.fulfill();
			}
			else{
				this.$log.error('AccountManager: Rejecting save accountsummaries info.');
				d.reject(Strings.ERROR_ACCOUNT_SUMMARIES_SAVE)
			}
			
			this.$log.debug('AccountManager: Returning save accountsummaries info.');
			return d.promise();
		}
		
		
		/**
		 * Delete all accounts data.
		 */
		public deleteAllAccounts(){
			this.ACCOUNTS.flush();
		}
	}
}