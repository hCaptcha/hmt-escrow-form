const EscrowFactory = require('./ABIs/Escrow')
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
    this._contract = new web3Instance.eth.Contract(NFT_ABI, NFT_CONTRACT_ADDRESS)
    this._owner = OWNER_ADDRESS
  }
}

module.exports = ETHInterface