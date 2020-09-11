from flask import Flask, render_template, request
from flask_wtf import FlaskForm, RecaptchaField
from flask_wtf.file import FileAllowed 

from wtforms import StringField, FileField, SubmitField
from wtforms.validators import DataRequired
import json
import basemodels
import requests
from hmt_escrow.job import Job

app = Flask(__name__)

HMT_API = 'http://127.0.0.1:8000/labeling-requests'

class ManifestUploaderForm(FlaskForm):
  """Manifest uploading form"""
  gas_payer = StringField('Gas Payer', [DataRequired()])
  gas_payer_priv = StringField('Gas Payer Private Key', [DataRequired()])
  rep_oracle_pub_key = StringField('Reputation Oracle Public Key', [DataRequired()])
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
    job = Job(credentials, manifest)
    if(job.launch(form.rep_oracle_pub_key.data)):
      return render_template('success.html')

  return render_template('base.html', form=form)


@app.route('/view-requests')
def view_labeling_requests():
  if 'id' in request.args:
    id = request.args['id']
    try:
      res = requests.get('{}/{}'.format(HMT_API, id))
      data = json.loads(res.text)['data']
      if data is not None:
        return render_template('view-manifest.html', data=json.dumps(data,  separators=(',', ':'), indent=2), error=None)
      else:
        return render_template('view-manifest.html', error="Couldn't reach server", data=None)
    except Exception as e:
      print(e)
      return render_template('view-manifest.html', error="Couldn't reach server", data=None, highest_bid_meta=None)
  else:
    try: 
      res = requests.get(HMT_API)
      if res.status_code == 200:
        data = json.loads(res.text)['data']
        sorted_data = sorted(data, key=lambda x: x['task_bid_price'], reverse=True)
        highest_bid = sorted_data[0]['task_bid_price']
        highest_bid_meta = {
          'highest_bid': highest_bid,
          'tasks_at_bid': len(list(filter(lambda x: x['task_bid_price'] == highest_bid, sorted_data)))
        }
        return render_template('view.html', error=None, data=sorted_data, highest_bid_meta=highest_bid_meta)
    except Exception as e:
      print(e)
      return render_template('view.html', error="Couldn't reach server", data=None, highest_bid_meta=None)


  