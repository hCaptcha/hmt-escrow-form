import '../styles/components/RawJobForm.css'

import React, { Component } from 'react'
const { Job } = require('hmt-escrow-js')
const CONFIG = require('../config')

class RawJobForm extends Component {
  constructor() {
    super()
    this.state = {
      gasPayer: '',
      gasPayerPriv: '',
      repOraclePubKey: '',
      manifestUrl: '',
      factoryAddr: '',
      errors: []
    }

    this.onChange = this.onChange.bind(this)
    this.submit = this.submit.bind(this)
    this.validateForm = this.validateForm.bind(this)
  }

  onChange(elem, val) {
    this.setState({
      [elem]: val
    })
  }

  validateForm() {
    const { gasPayer, gasPayerPriv, repOraclePubKey, manifestUrl} = this.state
    let formValid = true
    let updatedErrors = []

    if(gasPayer === "") {
      updatedErrors.push("Missing value: Gas Payer")
      formValid = false
    }
    if(gasPayerPriv === "") {
      updatedErrors.push("Missing value: Gas Payer Private")
      formValid = false
    }
    if(repOraclePubKey === "") {
      updatedErrors.push("Missing value: Reputation Oracle")
      formValid = false
    }
    if(manifestUrl === "") {
      updatedErrors.push("Missing value: Manifest URL")
      formValid = false
    }
    this.setState({
      errors: updatedErrors
    })
    return formValid
  }

  submit() {
    if(this.validateForm()) {
      this.setState({
        errors: []
      })
      const { gasPayer, gasPayerPriv, repOraclePubKey, manifestUrl, factoryAddr} = this.state
      try {
        const job = new Job(CONFIG.ethProviderUrl)
        job.initialize(
          gasPayer, 
          gasPayerPriv, 
          repOraclePubKey, 
          manifestUrl, 
          CONFIG.hmtokenAddr, 
          factoryAddr)
        job.launch()
        alert("Manifest processing")
      }
      catch(e) {
        this.setState({
          errors: e
        })
      }
    }   
  }

  render() {
    return (
      <div className="formwrapper">
        <div className="form">
          <div className="form-field">
            {
              this.state.errors.map(error => {
                return (
                  <div className="errors">
                  {error}
                  </div>
                )
              })
            }
          </div>
          <div className="form-field">
            <label for="gasPayer">Gas Payer</label> 
            <input 
              id="gasPayer" 
              name="gasPayer"  
              type="text" 
              value={this.state.gasPayer} 
              onChange={e => this.onChange('gasPayer', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label for="gasPayerPriv">Gas Payer Private</label> 
            <input 
              id="gasPayerPriv" 
              name="gasPayerPriv"  
              type="text" 
              value={this.state.gasPayerPriv}
              onChange={e => this.onChange('gasPayerPriv', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label for="repOraclePubKey">Reputation Oracle Public Key</label> 
            <input
              id="repOraclePubKey" 
              name="repOraclePubKey"  
              type="text" 
              value={this.state.repOraclePubKey}
              onChange={e => this.onChange('repOraclePubKey', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label for="manifestUrl">Manifest Url</label> 
            <input
              id="manifestUrl" 
              name="manifestUrl"  
              type="text" 
              value={this.state.manifestUrl} 
              onChange={e => this.onChange('manifestUrl', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label for="factoryAddr">Factory Address</label> 
            <input
              id="factoryAddr" 
              name="factoryAddr"  
              type="text" 
              value={this.state.factoryAddr}
              onChange={e => this.onChange('factoryAddr', e.target.value)}
            />
          </div>
          <div className="form-field">
            <div className="submit-btn" id="submit-btn" onClick={this.submit}>Submit</div>
          </div>
        </div>
      </div>
    )
  }
}

export default RawJobForm