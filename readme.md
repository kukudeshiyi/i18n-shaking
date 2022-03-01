# i18n-shaking

## Install

## Use

1. Create a file named "i18nShaking.config.json" in the project root directory,The configuration example is as follows

   ```json
   {
     "entry": "./src/index.tsx",
     "output": "./output",
     "translateFileDirectoryPath": "./src/components/I18n",
     "translateFileNames": ["en.json", "vi.json", "th.json"],
     "importInfos": [
       { "name": "i18n", "path": "" },
       { "name": "", "path": "i18nDir" },
       { "name": "t", "path": "i18n-t" },
       { "name": "useTranslation", "path": "react-i18next" }
     ],
     "frame": "react"
   }
   ```

2. If it is a global installation,execute the following command directly

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
