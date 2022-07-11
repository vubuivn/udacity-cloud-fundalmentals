import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
(async () => {
  const app = express();
  // Set the network port
  const port = process.env.PORT || 3000;
  app.use(bodyParser.json());
  // Root Endpoint
  app.get( "/", async ( req: Request, res: Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  app.get("/filteredimage/",
    async(req: Request, res: Response)=>{
      let image_url = req.query.image_url
      if (!image_url || typeof image_url !== 'string' || image_url.trim().length === 0){
          return res.status(400)
          .send("Please enter the url following pattern: /filteredimage?image_url={{}} ")
      }
      let path = await filterImageFromURL(image_url)
      return res.status(200)
      .sendFile(path, ()=>{
        deleteLocalFiles([path])
      })
    })
  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();