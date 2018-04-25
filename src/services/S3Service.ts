import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import * as AWS from 'aws-sdk';

const { S3_KEY, S3_SECRET, S3_REGION } = process.env;
if (!S3_KEY)    throw new Error(`S3_KEY is not defined in .env`);
if (!S3_SECRET) throw new Error(`S3_SECRET is not defined in .env`);
if (!S3_REGION) throw new Error(`S3_REGION is not defined in .env`);

AWS.config.update({
  accessKeyId: S3_KEY,
  secretAccessKey: S3_SECRET,
  region: S3_REGION
});

const s3 = new AWS.S3();
const S3_BUCKET = process.env.S3_BUCKET || 'popprobe-saas';

class S3Service {

  upload() {
    const storage = multerS3({
      s3,
      bucket: S3_BUCKET,
      key: function (req, file, cb) {
        debugger;
        console.log(file);
        var mime = file.mimetype.split('/');
        cb(null, file.fieldname + '-' + Date.now() + '.' + mime[1])
      },
      acl: 'public-read',
    });
    return multer({ storage })
  }

  uploadBase64({ fileBuffer, contentType }, fileName, key) {
    const data = {
      Key: key,
      Bucket:  S3_BUCKET,
      Body: fileBuffer,
      ContentEncoding: 'base64',
      ContentType: contentType,
      Metadata: {name: fileName}
    };

    return new Promise((resolve, reject) => {
      s3.putObject(data, function(err, data){
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  }

  getUrl(key) {
    const params = {
      Bucket: S3_BUCKET,
      Key: key,
    };
    return s3.getSignedUrl('getObject', params);
  }
}

var Image = new S3Service();
export default Image;