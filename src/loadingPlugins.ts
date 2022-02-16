import { PluginType } from './types';
export function loadingPlugins(plugins: Array<() => PluginType>) {
  return plugins.reduce(
    (pluginsArr: Array<PluginType>, pluginFactory: unknown) => {
      if (typeof pluginFactory === 'function') {
        const plugin = pluginFactory();
        if (
          typeof plugin.isFit === 'function' &&
          typeof plugin.parse === 'function'
        ) {
          pluginsArr.push(plugin);
        }
      }
      return pluginsArr;
    },
    []
  );
}
