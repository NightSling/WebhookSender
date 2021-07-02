import { Router, Request, Response } from 'express';
import { Webhook, MessageBuilder } from '../../webhook-discord/lib/webhook.js';
import * as path from 'path';

const MainRouter = Router();

MainRouter.get('/', (req, res) => {
  res.sendfile(path.resolve('public/index.html'))
});

MainRouter.post('/', (req, res) => {
  try {
    JSON.parse(JSON.stringify(req.body));
  }catch(e) {
    res.status(400);
    res.json({
      "ERROR" : "Invalid JSON data!"
    });
    return;
  }
  const body : JsonData = req.body;
  if(!body) {
    res.status(400);
    res.end();
  }

  if(!body.uri) {
    res.json({
      "ERROR" : `'uri' field was expected to be string url but '${typeof body.uri}' was found!`
    })
    res.status(400);
    res.end();
    return;
  }

  if(!body.name) {
    res.json({
      "ERROR" : `'name' field was expected to be string but '${typeof body.name}' was found!`
    })
    res.status(400);
    res.end();
    return;
  }
  try {
    sendWebhook(body, res); 
  }catch (e) {
    res.json({
      "ERROR" : e.message
    });
    res.status(400);
  }
});

const sendWebhook = (data : JsonData, res : Response) => {
  try{
    const Hook = new Webhook(data.uri, res);
    const message = new MessageBuilder();
    if(data.avatar) {
      message.setAvatar(data.avatar);
    }
    if(data.name) {
      message.setName(data.name);
    }
    if(data.text) {
      message.setText(data.text);
    }
    if(data.title) {
      message.setTitle(data.title);
    }
    if(data.color) {
      message.setColor(data.color);
    }
    if(data.description) {
      message.setDescription(data.description);
    }
    if(data.fieldtitle && data.value) {
      message.addField(data.fieldtitle, data.value, false);
    }
    console.log(message.getJSON());
    Hook.send(message, res)
    
      .then(() => {
        res.json(
          {
            "INFO" : "Success! Message in the way!"  
          }
        );
        res.status(200);
      })

      .catch((e) => {
        res.status(400);
      });
  }catch(e) {
    throw e;
  }
};

interface JsonData{
  uri: string
  name: string | undefined
  text: string | undefined
  avatar: string | undefined
  title: string
  description: string
  color: string
  fieldtitle: string
  value: string
}
export default MainRouter;
