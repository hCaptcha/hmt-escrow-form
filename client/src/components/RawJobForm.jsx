import React, { Component } from 'react'
import '../styles/components/RawJobForm.css'

class RawJobForm extends Component {
  constructor() {
    super()
    this.state = {
      gas_payer: '',
      gas_payer_priv: '',
      rep_oracle_pub_key: '',
      manifest_url: '',
      factory_addr: '',
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
    const { gas_payer, gas_payer_priv, rep_oracle_pub_key, manifest_url} = this.state
    let formValid = true
    let updatedErrors = []

    if(gas_payer === "") {
      updatedErrors.push("Missing value: Gas Payer")
      formValid = false
    }
    if(gas_payer_priv === "") {
      updatedErrors.push("Missing value: Gas Payer Private")
      formValid = false
    }
    if(rep_oracle_pub_key === "") {
      updatedErrors.push("Missing value: Reputation Oracle")
      formValid = false
    }
    if(manifest_url === "") {
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
      console.log(this.state)
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
            <label for="gas_payer">Gas Payer</label> 
            <input 
              id="gas_payer" 
              name="gas_payer"  
              type="text" 
              value={this.state.gas_payer} 
              onChange={e => this.onChange('gas_payer', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label for="gas_payer_priv">Gas Payer Private</label> 
            <input 
              id="gas_payer_priv" 
              name="gas_payer_priv"  
              type="text" 
              value={this.state.gas_payer_priv}
              onChange={e => this.onChange('gas_payer_priv', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label for="rep_oracle_pub_key">Reputation Oracle Public Key</label> 
            <input
              id="rep_oracle_pub_key" 
              name="rep_oracle_pub_key"  
              type="text" 
              value={this.state.rep_oracle_pub_key}
              onChange={e => this.onChange('rep_oracle_pub_key', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label for="manifest_url">Manifest Url</label> 
            <input
              id="manifest_url" 
              name="manifest_url"  
              type="text" 
              value={this.state.manifest_url} 
              onChange={e => this.onChange('manifest_url', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label for="factory_addr">Factory Address</label> 
            <input
              id="factory_addr" 
              name="factory_addr"  
              type="text" 
              value={this.state.factory_addr}
              onChange={e => this.onChange('factory_addr', e.target.value)}
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