import { RuleTester } from 'eslint';

import rule from '../../../lib/rules/no-unused-class';

import { test } from '../../utils';

const ruleTester = new RuleTester();

ruleTester.run('no-unused-class', rule, {
  /*
     valid cases
   */
  valid: [
    /*
      absolute import
      eg: 'foo/bar.scss'
    */
    test({
      code: `
        import s from 'test/files/noUndefClass1.scss';

        export default Foo = () => (
          <div className={s.container}></div>
        );
      `,
    }),
    /*
       dot notation and square brackets
       eg: s.foo and s['bar']
     */
    test({
      code: `
        import s from './noUnusedClass1.scss';

        export default Foo = () => (
          <div className={s.foo}>
            <div className={s['bar']}>
              <span className={s.bold}></span>
            </div>
          </div>
        );
      `,
    }),
    /*
       ignore global scope selector
     */
    test({
      code: `
        import s from './noUnusedClass2.scss';

        export default Foo = () => (
          <div className={s.foo}>
            <span className="bar"></span>
          </div>
        );
      `,
    }),
    /*
       ignore props exported by ICSS :export pseudo-selector
       https://github.com/css-modules/icss#export
     */
    test({
      code: `
        import s from './export1.scss';

        export default Foo = () => (
          <div className={s.bar}></div>
        );
      `,
    }),
    /*
       check if composes classes are ignored
     */
    test({
      code: `
        import s from './composes1.scss';

        export default Foo = () => (
          <div className={s.bar}>
            <span className={s.baz}></span>
          </div>
        );
      `,
    }),
    /*
       composes with multiple classes
     */
    test({
      code: `
        import s from './composesMultiple1.scss';

        export default Foo = () => (
          <div className={s.bar}>
            <span className={s.baz}></span>
          </div>
        );
      `,
    }),
    /*
       check if @extend classes are ignored
     */
    test({
      code: `
        import s from './extend1.scss';

        export default Foo = () => (
          <div className={s.bar}>
            <span className={s.baz}></span>
          </div>
        );
      `,
    }),
    /*
       check if classes are ignored if they only
       exist for nesting parent selectors (`&`)
     */
    test({
      code: `
        import s from './parentSelector7.scss';

        export default Foo = () => (
          <div>
            <span className={s.foo_bar}></span>
            <span className={s.foo_baz}></span>
          </div>
        );
      `,
    }),
    /*
       check if camelCase=true classes work as expected
     */
    test({
      code: `
        import s from './noUnusedClass3.scss';

        export default Foo = () => (
          <div className={s.fooBar}>
            <div className={s.barFoo}></div>
            <div className={s.alreadyCamelCased}></div>
            <div className={s.snakeCased}></div>
          </div>
        );
      `,
      options: [{ camelCase: true }],
    }),
    test({
      code: `
        import s from './noUnusedClass3.scss';

        export default Foo = () => (
          <div className={s['foo-bar']}>
            <div className={s['bar-foo']}></div>
            <div className={s.alreadyCamelCased}></div>
            <div className={s.snake_cased}></div>
          </div>
        );
      `,
      options: [{ camelCase: true }],
    }),
    /*
       check if camelCase=dashes classes work as expected
     */
    test({
      code: `
        import s from './noUnusedClass3.scss';

        export default Foo = () => (
          <div className={s.fooBar}>
            <div className={s.barFoo}></div>
            <div className={s.alreadyCamelCased}></div>
            <div className={s.snake_cased}></div>
          </div>
        );
      `,
      options: [{ camelCase: 'dashes' }],
    }),
    test({
      code: `
        import s from './noUnusedClass3.scss';

        export default Foo = () => (
          <div className={s['foo-bar']}>
            <div className={s['bar-foo']}></div>
            <div className={s.alreadyCamelCased}></div>
            <div className={s.snake_cased}></div>
          </div>
        );
      `,
      options: [{ camelCase: 'dashes' }],
    }),
    /*
       check if camelCase=only classes work as expected
     */
    test({
      code: `
        import s from './noUnusedClass3.scss';

        export default Foo = () => (
          <div className={s.fooBar}>
            <div className={s.barFoo}></div>
            <div className={s.alreadyCamelCased}></div>
            <div className={s.snakeCased}></div>
          </div>
        );
      `,
      options: [{ camelCase: 'only' }],
    }),
    /*
       check if camelCase=dashes-only classes work as expected
     */
    test({
      code: `
        import s from './noUnusedClass3.scss';

        export default Foo = () => (
          <div className={s.fooBar}>
            <div className={s.barFoo}></div>
            <div className={s.alreadyCamelCased}></div>
            <div className={s.snake_cased}></div>
          </div>
        );
      `,
      options: [{ camelCase: 'dashes-only' }],
    }),
  ],
  /*
     invalid cases
   */
  invalid: [
    test({
      code: `
        import s from './noUnusedClass1.scss';

        export default Foo = () => (
          <div className={s.bar}></div>
        );
      `,
      errors: [
        'Unused classes found in noUnusedClass1.scss: foo, bold'
      ]
    }),
    /*
       ignored global scope selector class
     */
    test({
      code: `
        import s from './noUnusedClass2.scss';

        export default Foo = () => (
          <div>
          </div>
        );
      `,
      errors: [
        'Unused classes found in noUnusedClass2.scss: foo'
      ]
    }),
    /*
       check less support
     */
    test({
      code: `
        import s from './noUnusedClass1.less';

        export default Foo = () => (
          <div>
          </div>
        );
      `,
      errors: [
        'Unused classes found in noUnusedClass1.less: foo'
      ]
    }),
    /*
       check composes support
     */
    test({
      code: `
        import s from './composes1.scss';

        export default Foo = () => (
          <div className={s.bar}></div>
        );
      `,
      errors: [
        'Unused classes found in composes1.scss: baz'
      ]
    }),
    /*
       check multiple composes support
     */
    test({
      code: `
        import s from './composesMultiple1.scss';

        export default Foo = () => (
          <div className={s.bar}></div>
        );
      `,
      errors: [
        'Unused classes found in composesMultiple1.scss: baz'
      ]
    }),
    /*
       check @extend support
     */
    test({
      code: `
        import s from './extend1.scss';

        export default Foo = () => (
          <div className={s.bar}></div>
        );
      `,
      errors: [
        'Unused classes found in extend1.scss: baz'
      ]
    }),
    /*
       using parent selector (`&`)
     */
    test({
      code: `
        import s from './parentSelector4.scss';

        export default Foo = () => (
          <div className={s.foo}>
            <div className={s.foo_baz}></div>
          </div>
        );
      `,
      errors: [
        'Unused classes found in parentSelector4.scss: foo_bar',
      ],
    }),
    test({
      code: `
        import s from './parentSelector8.scss';

        export default Foo = () => (
          <div className={s.foo} />
        );
      `,
      errors: [
        'Unused classes found in parentSelector8.scss: foo_bar',
      ],
    }),
    /*
       should detect if camel case properties are NOT used when camelCase=true
     */
    test({
      code: `
        import s from './noUnusedClass3.scss';

        export default Foo = () => (
          <div className={ s.fooBar } />
        );
      `,
      options: [{ camelCase: true }],
      errors: [
        'Unused classes found in noUnusedClass3.scss: bar-foo, alreadyCamelCased, snake_cased',
      ],
    }),
    /*
       should detect if camel case properties are NOT used when camelCase=dashes
     */
    test({
      code: `
        import s from './noUnusedClass3.scss';

        export default Foo = () => (
          <div className={ s.fooBar }>
            <div className={s.snakeCased}></div>
          </div>
        );
      `,
      options: [{ camelCase: 'dashes' }],
      errors: [
        'Unused classes found in noUnusedClass3.scss: bar-foo, alreadyCamelCased, snake_cased',
      ],
    }),
    /*
       should detect if camel case properties are NOT used when camelCase=only
     */
    test({
      code: `
        import s from './noUnusedClass3.scss';

        export default Foo = () => (
          <div className={s['foo-bar']}>
            <div className={s.barFoo}></div>
            <div className={s.snakeCased}></div>
            <div className={s.bar}></div>
          </div>
        );
      `,
      options: [{ camelCase: 'only' }],
      errors: [
        'Unused classes found in noUnusedClass3.scss: foo-bar, alreadyCamelCased',
      ],
    }),
    /*
       should detect if camel case properties are NOT used when camelCase=dashes-only
     */
    test({
      code: `
        import s from './noUnusedClass3.scss';

        export default Foo = () => (
          <div className={s['foo-bar']}>
            <div className={s.barFoo}></div>
            <div className={s.snakeCased}></div>
            <div className={s.bar}></div>
          </div>
        );
      `,
      options: [{ camelCase: 'dashes-only' }],
      errors: [
        'Unused classes found in noUnusedClass3.scss: foo-bar, alreadyCamelCased, snake_cased',
      ],
    }),
  ],
});
