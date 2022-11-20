const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb+srv://*****', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const requestSchema = new mongoose.Schema({
  theRequest: String,
});

// create a virtual paramter that turns the default _id field into id
requestSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
  });

// Ensure virtual fields are serialised when we turn this into a JSON object
requestSchema.set('toJSON', {
  virtuals: true
});

// create a model for tickets
const Request = mongoose.model('Request', requestSchema);

app.get('/api/requests', async (req, res) => {
  try {
    let requests = await Request.find();
    res.send({
      requests: requests
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/requests', async (req, res) => {
  const request = new Request({
    theRequest: req.body.theRequest,
  });
  try {
    await request.save();
    res.send({
      request: request
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/requests/:id', async (req, res) => {
  try {
    await Request.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));