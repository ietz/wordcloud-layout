import { WordcloudConfig } from './model';

export class Wordcloud {
  constructor(private readonly config: WordcloudConfig) {
  }

  size = this.configAccessor('size');
  fontSize = this.configAccessor('fontSize');
  fontWeight = this.configAccessor('fontWeight');
  fontFamily = this.configAccessor('fontFamily');

  start() {
    return this;
  }

  stop() {
    return this;
  }

  configAccessor<Property extends keyof WordcloudConfig>(property: Property) {
    const cloud = this;

    function accessor(): WordcloudConfig[Property];
    function accessor<Value extends WordcloudConfig[Property]>(value: Value): Wordcloud;
    function accessor(...args: [] | [WordcloudConfig[Property]]) {
      if (args.length === 0) {
        return cloud.config[property];
      } else {
        return new Wordcloud({...cloud.config, [property]: args[0]})
      }
    }

    return accessor;
  }
}

export const wordcloud = () => {
  return new Wordcloud({
    size: [512, 512],
    fontFamily: 'sans-serif',
    fontWeight: 400,
    fontSize: 12,
  })
}
