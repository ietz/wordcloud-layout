import { LayoutProperties, Word, WordConfig, WordProperties } from './model';
import { layout } from '../layout';

export class Wordcloud<T> {
  constructor(
    private readonly layoutConfig: LayoutProperties<T>,
    private readonly wordConfig: WordConfig<T>,
  ) {
  }

  size = this.wordcloudConfigAccessor('size');
  data = this.wordcloudConfigAccessor('data');
  seed = this.wordcloudConfigAccessor('seed');
  text = this.wordConfigAccessor('text');
  rotation = this.wordConfigAccessor('rotation');
  required = this.wordConfigAccessor('required');
  fontSize = this.wordConfigAccessor('fontSize');
  fontFamily = this.wordConfigAccessor('fontFamily');
  fontWeight = this.wordConfigAccessor('fontWeight');
  padding = this.wordConfigAccessor('padding');

  start() {
    return layout({
      ...this.layoutConfig,
      words: this.layoutConfig.data.map(datum => wordFromWordConfig(this.wordConfig, datum)),
    });
  }

  wordcloudConfigAccessor<Property extends keyof LayoutProperties<T>>(property: Property) {
    const cloud = this;

    function accessor(): LayoutProperties<T>[Property];
    function accessor<Value extends LayoutProperties<T>[Property]>(value: Value): Wordcloud<T>;
    function accessor(...args: [] | [LayoutProperties<T>[Property]]) {
      if (args.length === 0) {
        return cloud.layoutConfig[property];
      } else {
        return new Wordcloud({...cloud.layoutConfig, [property]: args[0]}, cloud.wordConfig);
      }
    }

    return accessor;
  }

  wordConfigAccessor<Property extends keyof WordConfig<T>>(property: Property) {
    const cloud = this;

    function accessor(): WordConfig<T>[Property];
    function accessor<Value extends WordProperties[Property]>(value: Value): Wordcloud<T>;
    function accessor<Accessor extends WordConfig<T>[Property]>(value: Accessor): Wordcloud<T>;
    function accessor(...args: [] | [WordProperties[Property]] | [WordConfig<T>[Property]]) {
      if (args.length === 0) {
        return cloud.wordConfig[property];
      } else {
        const arg = args[0];
        return new Wordcloud(
          cloud.layoutConfig,
          {
            ...cloud.wordConfig,
            [property]: typeof arg === 'function' ? arg : () => arg,
          }
        )
      }
    }

    return accessor;
  }
}

const wordFromWordConfig = <T>(wordConfig: WordConfig<T>, datum: T): Word<T> => {
  return Object.fromEntries(
    Object.entries(wordConfig).map(([property, accessor]) => [property, accessor(datum)])
  ) as unknown as Word<T>;
}

export const wordcloud = <T>() => {
  return new Wordcloud<T>(
    {
      size: [512, 512],
      data: [],
      seed: 'wordcloud',
    },
    {
      text: () => 'Lorem',
      rotation: () => 0,
      required: () => true,
      fontSize: () => 12,
      fontFamily: () => 'sans-serif',
      fontWeight: () => 400,
      padding: () => 4,
    }
  )
}
