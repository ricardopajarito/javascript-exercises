/*const { RekognitionClient, DetectTextCommand } = require("@aws-sdk/client-rekognition");

let mensaje = "";
let statusCode = 200;
exports.handler = async (event) => {
    try {
        const bucket = 'richardobucket'; // the bucketname without s3://
        const photo = 'ticket.jpeg'; // the name of file
        let msj = "Nothing";

        // const client = new AWS.Rekognition();
        const params = {
            Image: {
                S3Object: {
                    Bucket: bucket,
                    Name: photo
                },
            },
        }

        const client = new RekognitionClient();
        const command = new DetectTextCommand(params);
        const response = await client.send(command);
        msj = "Chido";

        console.log(`Detected Text for: ${photo}`)
        //console.log(typeof response.TextDetections);
        //console.log(response.TextDetections);
        let texto = "";
        let parentID = null;
        let precios = [];
        let productos = [];
        response.TextDetections.forEach(label => {
            if(label.Type === "LINE") {
              let tmp = parseInt(label.DetectedText, 10);
              //if(!isNaN(tmp)){ //Si es un numero
                tmp = tmp.toString();
              //}
              if(tmp.length <= 9){
                
                if(tmp !== "NaN") {
                  //console.log("Precio: ");
                  //console.log(`${label.DetectedText} Type: ${label.Type}`);
                  //console.log(`${tmp} Type: ${label.Type}`);
                  precios = [...precios, tmp];
                } 
                //else {
                //  console.log(`${tmp} Type: ${label.Type}`);
                //}
              } else {
                //console.log("Nombre del producto: ");
                //console.log(`${label.DetectedText} Type: ${label.Type}`);
                productos = [...productos, label.DetectedText];
              }
            }
            
            
            //texto += `${label.DetectedText} `;
            //if (parentID === null || (parentID !== label.ParentId)) {
            //    parentID = label.ParentId;
            //    texto += "\n";
            //}
            
        })
        console.log(precios);
        console.log(productos);
        let productosPrecio = productos.map((producto, index) => {
          return {
            nombre: producto,
            precio: precios[index]
          }
        });
        console.log(productosPrecio);
        //console.log(texto)
        mensaje = msj;
    } catch (e) {
        console.log("error: ", e)
    }

    return {
        statusCode,
        body: JSON.stringify({ mensaje: mensaje }),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }
}
*/

const AWS = require("aws-sdk");
const stream = require("stream");
const yauzl = require("yauzl");
const s3 = new AWS.S3();

let mensaje = "";
let statusCode;


exports.handler = async (event) => {
    //const s3 = new AWS.S3();
    let Bucket = "richardobucket";
    
    const params = { 
        Bucket, 
        Key: "Archivo.zip" 
    };

    try {
    
        const object = await s3.getObject(params).promise();
        console.log("object: ", object);
        let valid = await validateZip(object.Body);
        console.log(valid);
        
        let result;
        if(valid){
          result = await extractZipAndUpload(Bucket, object.Body);
          console.log(result);
        }
        
        if(!result) {
          let msj = "No se procesó correctamente el archivo zip; ";
          if(!valid){
            msj = msj + "Falta el archivo de excel o la carpeta de imágenes.";
          }
          throw new Error(msj);
        }
        
        //let deleteZip = await s3.deleteObject(params).promise();
        //console.log(deleteZip);
        
        mensaje = "Se procesó correctamente el archivo zip.";
        statusCode = result ? 200 : 400;
        
        //await mostrarArchivos();
        
        //mensaje = valid ? "Contiene el zip y la carpeta de imagenes" : "Falta el archivo de excel o la carpeta de imagenes";
        //statusCode = valid ? 200 : 400;
        
    } catch (error) {
        statusCode = 400;
        mensaje = "Hubo un error! ";
        if (error !== undefined) {
            mensaje = mensaje + error.message;
        }
    }

    return {
        statusCode,
        body: JSON.stringify({ mensaje: mensaje }),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };

}

const validateZip = (buffer) => {
      return new Promise((resolve, reject) => {
        let isExcel = false;
        let isImage = false;
      yauzl.fromBuffer(buffer, { lazyEntries: true }, function (err, zipfile) {
        if (err) return Promise.reject(err);
        zipfile.readEntry();
        zipfile.on("entry", function (entry) {
          if (/\/$/.test(entry.fileName)) {
            zipfile.readEntry();
          } else {
            // file entry
            zipfile.openReadStream(entry, function (err, readStream) {
              if (err) return Promise.reject(err);
              
              try {
                const fileNames = entry.fileName.split(".");
                let fileNameArr = fileNames[0].split("/");
                let fileName = fileNameArr[fileNameArr.length - 1];
                const ext = fileNames[fileNames.length - 1];
                
                if(fileName.length > 0 && ext === "xlsx" || fileName.length > 0 && ext === "xls") {
                  isExcel = true;
                }
                
                if(fileName.length > 0 && ext === "jpg" || fileName.length > 0 && ext === "png" || fileName.length > 0 && ext === "jpeg") {
                  isImage = true;
                }
                
                const pass = new stream.PassThrough();
                readStream.pipe(pass);
                zipfile.readEntry();
              } catch (error) {
                console.log(error);
                reject(error);
              }
              
            });
          }
        });
        zipfile.on("end", () => {
          if(isExcel && isImage) {
            resolve(true);  
          } else {
            resolve(false);
          }
        });
      });
    });
};

const uploadStream = ({ Bucket, Key }) => {
    const pass = new stream.PassThrough();
    return {
      writeStream: pass,
      promise: s3.upload({ Bucket, Key, Body: pass }).promise(),
    };
};

const extractZipAndUpload = (Bucket, buffer) => {
    return new Promise((resolve, reject) => {
      yauzl.fromBuffer(buffer, { lazyEntries: true }, function (err, zipfile) {
        if (err) return Promise.reject(err);
        zipfile.readEntry();
        zipfile.on("entry", function (entry) {
          if (/\/$/.test(entry.fileName)) {
            zipfile.readEntry();
          } else {
            // file entry
            zipfile.openReadStream(entry, function (err, readStream) {
              if (err) return Promise.reject(err);
              
              try {
                const fileNames = entry.fileName.split(".");
                let fileNameArr = fileNames[0].split("/");
                let fileName = fileNameArr[fileNameArr.length - 1];
                const ext = fileNames[fileNames.length - 1];
                
                let folderName = "";
                let originalPath = fileNames[0].split("_")[0];
                
                if(ext !== "xlsx" && ext !== "xls") {
                  let pathArr = originalPath.split("/");
                  let sku = pathArr[pathArr.length - 1];
                  let path = sku.length === 0 ? originalPath : sku;
                  folderName = "/" + path; 
                } 
                
                if(fileName.length > 0) {
                  const { writeStream, promise } = uploadStream({
                    Bucket,
                    Key: `productos${folderName}/${fileName}.${ext}`,
                  });
                  readStream.pipe(writeStream);
                  promise.then(() => {
                    //console.log(entry.fileName + " Uploaded successfully!");
                    zipfile.readEntry();
                  });
                } else {
                  const pass = new stream.PassThrough();
                  readStream.pipe(pass);
                  zipfile.readEntry();
                }
              } catch (error) {
                  console.log(error);
                  reject(error);
              }
            });
          }
        });
        zipfile.on("end", () => resolve("end"));
      });
    });
  };
  
  const mostrarArchivos = async(Bucket) => {
    //const s3 = new AWS.S3();
    let sku = "sku001";
    let deleteParams = {
            Bucket,
            Prefix: `productos/${sku}/`
        };
    const listResults = await s3.listObjectsV2(deleteParams).promise();
    console.log(listResults);
    
    statusCode = 200;
    mensaje = "Se listo de forma correcta";
  }
  