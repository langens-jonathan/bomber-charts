import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('simple-pie-chart', 'Integration | Component | simple pie chart', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{simple-pie-chart}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#simple-pie-chart}}
      template block text
    {{/simple-pie-chart}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
