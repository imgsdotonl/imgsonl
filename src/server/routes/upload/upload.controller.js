import url from 'url';
import path from 'path';
import request from 'request';
import fs from 'fs-extra';
import shortId from 'shortid';
import Busboy from 'busboy';
import Image from './image.model';

const gm = require('gm').subClass({ imageMagick: true });

const regex = new RegExp('^.*.((j|J)(p|P)(e|E)?(g|G)|(g|G)(i|I)(f|F)|(p|P)(n|N)(g|G))$');

export async function uploadFromUrl(req, res, next) {
  const download = (uri, filename, callback) => {
    request.head(uri, (err, res, body) => {
      if (filename.match(regex)) {
        gm(request(uri)).noProfile().quality(30).write(`./public/files/${filename}`, callback);
      } else {
        return next(err);
      }
    });
  };

  const urlParsed = url.parse(req.body.url);
  if (urlParsed.pathname) {
    const onlyTheFilename = urlParsed.pathname
      ? urlParsed.pathname.substring(urlParsed.pathname.lastIndexOf('/') + 1).replace(/((\?|#).*)?$/, '')
      : '';
    const imgId = shortId.generate();
    const newFileName = imgId + path.extname(onlyTheFilename);
    download(urlParsed.href, newFileName, async () => {
      const newImage = await Image.create({
        originalname: onlyTheFilename,
        filename: newFileName,
        path: `files/${newFileName}`,
        url: `https://i.imgs.onl/${newFileName}`,
        imageId: imgId,
      });

      return res.status(201).json(newImage);
    });
  }
}

export async function getImage(req, res) {
  const theImage = await Image.findOne({
    imageId: req.params.imageId,
  });
  if (!theImage) {
    return res.status(400);
  }

  return res.status(200).json(theImage);
}

export async function uploadImage(req, res, next) {
  let fstream;
  const busboy = new Busboy({ headers: req.headers });

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    if (filename.length === 0) {
      res.status(400).json({
        message: 'No file selected!',
      });
    }
    if (!filename.match(regex)) {
      return res.status(400).json('Invalid file type');
    }
    // define temporary file path before processing.
    const tmpFilePath = path.join(process.cwd(), './tmp');
    // generate a shortid for the new file name and keep the ext
    const imgId = shortId.generate();
    const newFileName = imgId + path.extname(filename);
    // stream to file
    fstream = fs.createWriteStream(`./tmp/${newFileName}`);
    // wrtie temporary file from stream
    file.pipe(fstream);
    // once file is written and close is emitted
    fstream.on('close', () => {
      // get the file from temp loc
      const fileLoc = path.join(tmpFilePath, newFileName);
      // create a readstream
      const readstream = fs.createReadStream(fileLoc);
      // send through graphicsmagick
      gm(readstream).noProfile().quality(30).write(`./public/files/${newFileName}`, async (err) => {
        if (err) {
          return res.status(500).send('Could not parse upload completely.');
        }
        fs.removeSync(fileLoc);

        const newImage = await Image.create({
          originalname: filename,
          filename: newFileName,
          path: `files/${newFileName}`,
          url: `https://i.imgs.onl/${newFileName}`,
          imageId: imgId,
        });

        return res.status(201).json(newImage);
      });
    });
  });

  busboy.on('error', (error) => {
    console.log('Error', 'Something went wrong parsing the form', error);
    res.status(500).send(`Could not parse upload completely: ${error}`);
  });

  return req.pipe(busboy);
}
