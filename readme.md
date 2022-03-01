# i18n-shaking

## Install

## Use

1、在项目根目录下创建 i18nShaking.config.json
2、配置示例如下

```
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
