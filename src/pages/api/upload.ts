// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiHandler } from "next";
import fs from "fs";
import tinify from "tinify";
import formidable, { File } from "formidable";
import OSS from "ali-oss";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Ali OSS options, you can get these options from Ali OSS console.
 * If you use other CDN provider, you can change this options.
 * The value of these options are fake, you should change them.
 */
const ALI_OSS_OPTIONS: OSS.Options = {
  bucket: process.env.ALI_OSS_BUCKET,
  region: process.env.ALI_OSS_REGION,
  accessKeyId: process.env.ALI_OSS_ACCESS_KEY_ID!,
  accessKeySecret: process.env.ALI_OSS_ACCESS_KEY_SECRET!,
};

/**
 * Compress image by tinify, the tinyApiKey was provided by API request.
 * If you used Cya CDN, the tinyApiKey was provided by Cya CDN.
 * @param file
 * @param tinyApiKey
 */
const compressImage = async (file: File, tinyApiKey: string) => {
  console.log("Before compress", fs.statSync(file.filepath).size / 1024 + "KB");
  tinify.key = tinyApiKey;
  const source = tinify.fromFile(file.filepath);
  await source.toFile(file.filepath);
  console.log("After compress", fs.statSync(file.filepath).size / 1024 + "KB");
};

/**
 * Following code is used to upload image to Ali OSS.
 * If you want to change CDN provider, you can change this code.
 * @param file
 * @param prefixPath
 */
const uploadImage = async (file: File, prefixPath: string = "cya-cdn") => {
  const client = new OSS(ALI_OSS_OPTIONS);
  const filename = path.basename(file.filepath);
  const extname = path.extname(file.originalFilename || "") || ".png";
  const result = await client.put(
    path.join(prefixPath, filename + extname),
    file.filepath
  );
  return result.url;
};

const handler: NextApiHandler = async (req, res) => {
  const form = formidable({ encoding: "utf-8" });
  const [fields, files] = await form.parse(req);
  const file = (files.file as File[])[0];
  const cdnPrefixPath = fields.cdnPrefixPath?.[0];
  const tinyApiKey = fields.tinyApiKey?.[0];
  if (tinyApiKey) {
    await compressImage(file, tinyApiKey);
  }
  const cdnUrl = await uploadImage(file, cdnPrefixPath);
  fs.unlinkSync(file.filepath);
  return res.status(200).json({ cdnUrl });
};

export default handler;