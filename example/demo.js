class SelectBasicDemo extends DemoBase {
  get template() {
    return `
      <dl>
        <dt>Basic Usage</dt>
        <dd>
          <p>
            <jkl-select>
              <jkl-select-option value="1">Option 1</jkl-select-option>
              <jkl-select-option value="2">Option 2</jkl-select-option>
              <jkl-select-option value="3">Option 3</jkl-select-option>
              <jkl-select-option value="4">Option 4</jkl-select-option>
              <jkl-select-option value="5">Option 5</jkl-select-option>
            </jkl-select>
            <jkl-select value="3">
              <jkl-select-option value="1">Option 1</jkl-select-option>
              <jkl-select-option value="2">Option 2</jkl-select-option>
              <jkl-select-option value="3">Option 3</jkl-select-option>
              <jkl-select-option value="4">Option 4</jkl-select-option>
              <jkl-select-option value="5">Option 5</jkl-select-option>
            </jkl-select>
          </p>
        </dd>
      </dl>
    `;
  }
}

class SelectDisabledDemo extends DemoBase {
  get template() {
    return `
      <dl>
        <dt>Disabled</dt>
        <dd>
          <p>
            <jkl-select disabled="disabled"></jkl-select>
            <jkl-select disabled="disabled" value="1">
              <jkl-select-option value="1">Option 1</jkl-select-option>
            </jkl-select>
          </p>
        </dd>
      </dl>
    `;
  }
}

class SelectMultipleDemo extends DemoBase {
  get value() {
    return [ '3' ];
  }
  get template() {
    return `
      <dl>
        <dt>Multiple Select</dt>
        <dd>
          <p>
            <jkl-select multiple="multiple">
              <jkl-select-option value="1">Option 1</jkl-select-option>
              <jkl-select-option value="2">Option 2</jkl-select-option>
              <jkl-select-option value="3">Option 3</jkl-select-option>
              <jkl-select-option value="4">Option 4</jkl-select-option>
              <jkl-select-option value="5">Option 5</jkl-select-option>
            </jkl-select>
            <jkl-select multiple="multiple" value="{value}">
              <jkl-select-option value="1">Option 1</jkl-select-option>
              <jkl-select-option value="2">Option 2</jkl-select-option>
              <jkl-select-option value="3">Option 3</jkl-select-option>
              <jkl-select-option value="4">Option 4</jkl-select-option>
              <jkl-select-option value="5">Option 5</jkl-select-option>
            </jkl-select>
          </p>
        </dd>
      </dl>
    `;
  }
}

class SelectRemoteSearchDemo extends DemoBase {
  get template() {
    return `
      <dl>
        <dt>Remote Search</dt>
        <dd>
          <p>
            <jkl-select placeholder="Please enter a keyword"></jkl-select>
          </p>
        </dd>
      </dl>
    `;
  }
}

class DemoList extends Jinkela { // eslint-disable-line no-unused-vars
  init() {
    this.demoList = [
      new SelectBasicDemo(),
      new SelectDisabledDemo(),
      new SelectMultipleDemo(),
      new SelectRemoteSearchDemo() && 0
    ].filter(Boolean);
  }
  get template() {
    return `
      <div>
        <h2>Select</h2>
        <meta ref="demoList" />
      </div>
    `;
  }
  get styleSheet() {
    return `
      :scope {
        -webkit-font-smoothing: antialiased;
        font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
        > h2 {
          font-weight: 400;
          color: #1f2f3d;
          font-size: 28px;
          margin: 0;
        }
      }
    `;
  }
}
