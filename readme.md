# i18n-shaking

## Install

1. Install globally

```
npm install i18n-shaking -g
```

2. Install in the project

```
npm install i18n-shaking -D
```

## Usage

1. Create a file named "i18nShaking.config.json" in the project root directory,The configuration example is as follows

   ```json
   {
     "entry": ["./src/index.tsx"],
     "output": "./output",
     "translateFileDirectoryPath": "./src/components/I18n",
     "translateFileNames": ["en.json", "vi.json", "th.json"],
     "importInfos": [
       { "name": "i18n", "path": "" },
       { "name": "", "path": "i18nDir" },
       { "name": "t", "path": "i18n-t" },
       { "name": "useTranslation", "path": "react-i18next" }
     ],
     "frame": "react",
     "keyWhiteList": ["key1", "key2"]
   }
   ```

   If you want to use it in a reactNative project, you need to set the **frame** parameter to **react-native**

2. If it is a global installation, you can run as follows

   ```
   i18n-shaking
   ```

3. If only installed within the project，register i18n-shaking as an npm script in the package.json file,
   examples are as follows

   ```json
   {
     "scripts": {
       "shaking": "i18n-shaking"
     }
   }
   ```

   After that, run as follows

   ```
   npm run shaking
   ```

4. If you want to view this run log, you can run as follows

   ```
   i18n-shaking --log
   ```

5. If you want to know more, you can run as follows
   ```
   i18n-shaking --help
   ```
