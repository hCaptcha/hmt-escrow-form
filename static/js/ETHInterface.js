const EscrowABI= require('./ABIs/Escrow')
const EscrowFactoryABI = require('./ABIs/EscrowFactory')
const HDWalletProvider = require("truffle-hdwallet-provider")
const web3 = require('web3')


class ETHInterface {
  constructor(MNEMONIC, INFURA_KEY, OWNER_ADDRESS, NETWORK) {
    // Setups Required
    if (!MNEMONIC || !INFURA_KEY || !OWNER_ADDRESS || !NETWORK ) {
      console.error("Please set a mnemonic, infura key, owner, network, and contract address.")
      return
    }
    const provider = new HDWalletProvider(MNEMONIC, `https://${NETWORK}.infura.io/v3/${INFURA_KEY}`)
    
    const web3Instance = new web3(provider)

    // Internals
    this._owner = OWNER_ADDRESS
  }

  get_factory(factory_addr) {
    return new this.web3Instance.eth.Contract(EscrowFactoryABI, factory_addr)
  }

  get_escrow(escrow_addr) {
    return new this.web3Instance.eth.Contract(EscrowABI, escrow_addr)
  }

  async list_transactions(factory_addr) {
    try {
      const factory_contract = this.get_factory(factory_addr)
      let transactions = []

      factory_contract.escrowCounters.call(address,function(err, escrow_addr) {
        const escrow_manifest_url = await this.get_escrow(escrow_addr).methods.manifestUrl().call()
        transactions.push({escrow_addr: escrow_addr, manifest_url: escrow_manifest_url})
      });
    }
    catch(e) {
      console.log(e)
    }
  }
}

module.exports = ETHInterface