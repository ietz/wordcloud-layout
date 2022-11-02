import { WordcloudConfig } from './model';
import { layout } from '../layout';

export class Wordcloud {
  constructor(private readonly config: WordcloudConfig) {
  }

  size = this.configAccessor('size');
  fontWeight = this.configAccessor('fontWeight');
  fontFamily = this.configAccessor('fontFamily');
  data = this.configAccessor('data');

  start() {
    return layout(this.config);
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
    data: [],
  })
}
