const keythereum = require("keythereum");
const ETHInterface = require('./ETHInterface')

class Job {
  constructor(gas_payer, gas_payer_priv, rep_oracle_pub_key, manifest_url, manifest_json) {
    this._gas_payer = gas_payer;
    this._gas_payer_priv = gas_payer_priv;
    this._rep_oracle_pub_key = rep_oracle_pub_key;
    this._manifest_url = manifest_url;

    this.serialized_manifest = manifest_json;
    this.amount = null;

    if(!this._validate_credentials()) {
      throw Error('Invalid Combination of Public & Private key')
    }

    // Process Manifest
    this._process_manifest()
  }

  _validate_credentials() {
    const calculated_pub_key = ETHInterface.web3Instance.utils.toChecksumAddress(keythereum.privateKeyToAddress(this._gas_payer_priv))
    return ETHInterface.web3Instance.utils.toChecksumAddress(this._gas_payer) === calculated_pub_key
  }

  async launch() {
    // Only handling launch case where fresh factory is created for each escrow, in future, expand this to mimic python lib
    // Create Factory
    const factory_addr = await ETHInterface.init_factory(this._gas_payer, this._gas_payer_priv)
    if(!factory_addr) {
      throw Error('Could not deploy factory')
    }
    const factory = await ETHInterface.get_factory(factory_addr)

    const trusted_handler = [this._gas_payer]
    // Initialise Escrow, given a particular factory address
    const escrow_addr = await ETHInterface.init_escrow(factory, this._gas_payer, this._gas_payer_priv)
    const escrow = await ETHInterface.get_escrow(escrow_addr)

    // Setup job (eq. job.setup())
    const hmttoken_contract = await ETHInterface.get_hmt_token()

    // Transfer HMT
    await ETHInterface.transfer_hmt(hmttoken_contract, 
                                    escrow_addr,
                                    Math.round(Math.pow(this.amount * 10, 100)),
                                    this.gas_payer, 
                                    this._gas_payer_priv)
    // Setup Job
    await ETHInterface.setup_job(escrow,
                                  this.serialized_manifest.reputation_oracle_addr,
                                  this.serialized_manifest.recording_oracle_addr,
                                  Math.round(this.serialized_manifest.oracle_stake * 100),
                                  Math.round(this.serialized_manifest.oracle_stake * 100),
                                  this._manifest_url,
                                  "") 
  }

  _process_manifest() {
    // Download manifest if URL
    // Support for future stuff too like s3, direct upload etc.
    // Download & Parse Manifest if URL
    this.amount = Math.round(this.serialized_manifest.task_bid_price * this.serialized_manifest.job_total_tasks)
  }
}

module.exports = Job