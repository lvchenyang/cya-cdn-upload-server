
# Cya CDN Upload Server

![cover](https://ali.bczcdn.com/reading/ba767eb7-5fbd-4e98-b333-4741d218fcc3.png)

This is a server side API example for [Cya CDN](https://www.figma.com/community/plugin/1258264462999317788/Cya-CDN) plugin from figma. You can clone this code to local and start it to compress and upload Figma assets to remote CDN server without leaving Figma.

## How to use

1. Clone this repo to local
```
git clone https://github.com/lvchenyang/cya-cdn-upload-server.git
```

2. Install dependencies
```
npm install
```

3. Change OSS options in `src/pages/api/upload.ts`
```typescript
/**
 * Ali OSS options, you can get these options from Ali OSS console.
 * If you use other CDN provider, you can change this options.
 * The value of these options are fake, you should change them.
 */
const ALI_OSS_OPTIONS: OSS.Options = {
  bucket: "****",
  region: "****",
  accessKeyId: "****",
  accessKeySecret: "****",
};
```

3. Start server
```
npm run start
```

4. Open Figma, install [Cya CDN](https://www.figma.com/community/plugin/1258264462999317788/Cya-CDN) plugin and set `CDN Upload URL` to `http://localhost:3000/api/upload` in plugin settings.

5. Select some layers in Figma and click upload button in plugin panel, then you can see the CDN url at the left of the upload button, click it to and write into the clipboard.