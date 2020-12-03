import os
os.environ['HMTOKEN_ADDR'] = '0xFC9463c12ff705B6533924CAc2dE9244796e2344'
os.environ["ESCROW_ENDPOINT_URL"] = "http://127.0.0.1:9000"

from flask import Flask, render_template, request
from flask_wtf import FlaskForm, RecaptchaField
from flask_wtf.file import FileAllowed 

from wtforms import StringField, FileField, SubmitField
from wtforms.validators import DataRequired
import json
import basemodels
import requests
from hmt_escrow.job import Job
from eth_keys import keys
from eth_utils import decode_hex

import sys

def generate_pub_from_priv(priv_k):
  priv_key_bytes = decode_hex(priv_k)
  priv_key = keys.PrivateKey(priv_key_bytes)
  pub_key = priv_key.public_key
  return pub_key.to_hex()[2:].encode('utf-8')


app = Flask(__name__)


class ManifestUploaderForm(FlaskForm):
  """Manifest uploading form"""
  gas_payer = StringField('Gas Payer', [DataRequired()])
  gas_payer_priv = StringField('Gas Payer Private Key', [DataRequired()])
  rep_oracle_pub_key = StringField('Reputation Oracle Public Key', [DataRequired()])
  factory_addr = StringField('Factory Address', [DataRequired()])
  manifest = FileField('Manifest File',
                        validators=[
                          DataRequired(),
                          FileAllowed(['json'], 'Only .JSON Manifests allowed')
                      ])
  submit = SubmitField('Submit')


@app.route('/', methods=['GET', 'POST'])
def upload():
  form = ManifestUploaderForm(csrf_enabled=False)
  if form.validate_on_submit():
    f = form.manifest.data
    model = json.load(f)
    manifest = basemodels.Manifest(model)
    # Validate Manifest
    try:
      manifest.validate()
    except Exception as e:
      form.manifest.errors.append('Manifest invalid: {}'.format(str(e)))
    
    # Create & Deploy JOB
    credentials = {
      'gas_payer': form.gas_payer.data,
      'gas_payer_priv': form.gas_payer_priv.data
    }
    factory = form.factory_addr.data 
    rep_oracle_pub_key = generate_pub_from_priv(credentials['gas_payer_priv'])
    job = Job(credentials, manifest, factory)
    try:
      job.launch(rep_oracle_pub_key)
      job.setup()
      return render_template('success.html', addr=job.job_contract.address)
    except Exception as e:
      print(e)

  return render_template('base.html', form=form)

