class SelectTagRemove extends Jinkela {
  init() {
    this.element.jinkela = this;
    this.element.addEventListener('click', event => {
      event.jinkela = this;
      let removetagEvent = new CustomEvent('removetag', { bubbles: true, detail: this });
      this.element.dispatchEvent(removetagEvent);
    });
  }

  get template() {
    return `
      <svg viewBox="0 0 12 12">
        <path d="M3,3L9,9M3,9L9,3Z" stroke="#fff" />
      </svg>
    `;
  }

  get styleSheet() {
    return `
      :scope {
        margin-left: 4px;
        border-radius: 100%;
        cursor: pointer;
        background: #c0c4cc;
        width: 12px;
        height: 12px;
        &:hover {
          background: #909399;
        }
      }
    `;
  }
}

class SelectTag extends Jinkela {
  set option(value) {
    this.text = value.text;
  }
  get template() {
    return `
      <span>
        <span><meta ref="text"></span>
        <jkl-select-tag-remove option="{option}" owner="{owner}"></jkl-select-tag-remove>
      </span>
    `;
  }

  get styleSheet() {
    return `
      :scope {
        vertical-align: middle;
        display: inline-block;
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        white-space: nowrap;
        padding: 0 8px;
        color: #909399;
        box-sizing: border-box;
        border: 0;
        border-radius: 4px;
        margin: 3px;
        background-color: #f0f2f5;
        > * {
          display: inline-block;
          vertical-align: middle;
        }
      }
    `;
  }
}

class SelectOption extends Jinkela {
  get template() {
    return `
      <div role="option"><meta ref="children" /></div>
    `;
  }

  init() {
    this.element.jinkela = this;
    this.element.addEventListener('click', () => {
      let event = new CustomEvent('select', { bubbles: true, detail: this });
      this.element.dispatchEvent(event);
    });
  }

  set active(value) { this.element.classList[value ? 'add' : 'remove']('active'); }
  get active() { return this.element.classList.contains('active'); }

  set disabled(value) { this.element.classList[value ? 'add' : 'remove']('disabled'); }
  get disabled() { return this.element.classList.contains('disabled'); }

  get text() { return this.element.textContent; }
  set text(value) { this.element.textContent = value; }

  get styleSheet() {
    return `
      :scope {
        font-size: 14px;
        padding: 0 20px;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #606266;
        height: 34px;
        line-height: 34px;
        box-sizing: border-box;
        cursor: pointer;
        &:hover {
          background: #f5f7fa;
        }
        &.active {
          color: #409eff;
          font-weight: 700;
          &::after {
            content: '';
            border-style: solid;
            border-width: 0 0 1px 1px;
            display: block;
            width: 6px;
            height: 3px;
            position: absolute;
            right: 20px;
            top: 0;
            bottom: 0;
            margin: auto;
            transform: rotate(-45deg) scale(1.3);
          }
        }
      }
    `;
  }
}

class SelectDropdown extends Jinkela {
  get updateRect() {
    let value = () => {
      let { target } = this;
      if (!target) return;
      let rect = target.getBoundingClientRect();
      let { x, y, width, height } = rect;
      let { clientWidth, clientHeight } = document.body;
      this.element.style.minWidth = width + 'px';
      if (x > clientWidth / 2) {
        this.element.style.left = 'auto';
        this.element.style.right = clientWidth - x + width + 'px';
      } else {
        this.element.style.left = x + 'px';
        this.element.style.right = 'auto';
      }
      if (y > clientHeight / 2) {
        this.element.style.top = 'auto';
        this.element.style.bottom = clientHeight - y + 1 + 'px';
        this.element.classList.add('bottom');
      } else {
        this.element.style.top = y + height + 1 + 'px';
        this.element.style.bottom = 'auto';
        this.element.classList.remove('bottom');
      }
    };
    Object.defineProperty(this, 'updateRect', { value, configurable: true });
    return value;
  }

  getOptionObjects() {
    let optionList = this.element.querySelectorAll('[role=option]');
    let result = [];
    for (let i = 0; i < optionList.length; i++) {
      let { jinkela } = optionList[i];
      if (jinkela) result.push(jinkela);
    }
    return result;
  }

  updateOptionsActiveStateByValue(valueList) {
    let jinkelaMap = Object.create(null);
    let objects = this.getOptionObjects();
    for (let i = 0; i < objects.length; i++) {
      let jinkela = objects[i];
      jinkela.active = false;
      jinkelaMap[JSON.stringify(jinkela.value)] = jinkela;
    }
    let results = [];
    for (let i = 0; i < valueList.length; i++) {
      let key = JSON.stringify(valueList[i]);
      if (!(key in jinkelaMap)) continue;
      jinkelaMap[key].active = true;
      results.push(jinkelaMap[key]);
    }
    return results;
  }

  show(what) {
    let target;
    if (what instanceof Event) target = what.target;
    if (what instanceof Element) target = what;
    if (what instanceof Jinkela) target = what.element;
    this.target = target;
    this.updateRect();
    this.to(document.body);
    // Force Recalculate Style
    void getComputedStyle(this.element).transition;
    this.element.classList.add('popup');
    addEventListener('scroll', this.updateRect);
  }

  hide() {
    this.element.classList.remove('popup');
    setTimeout(() => this.element.remove(), 200);
    removeEventListener('scroll', this.updateRect);
  }

  init() {
    this.element.addEventListener('select', item => {
      this.selectHandler(item.detail);
    });
  }

  get template() {
    return `
      <div>
        <svg viewBox="0 0 12 6"><path d="M0,6L6,0L12,6" /></svg>
        <div class="list" ref="list"><meta ref="children" /></div>
      </div>
    `;
  }

  get styleSheet() {
    return `
      :scope {
        position: fixed;
        opacity: 0;
        visibility: hidden;
        transition: opacity .2s, visibility .2s, transform .2s;
        transform-origin: center top;
        transform: scaleY(0.001);
        margin: 12px 0;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        box-sizing: border-box;
        font-size: 14px;
        color: #606266;
        -webkit-font-smoothing: antialiased;
        > .list {
          &:empty::before {
            content: 'Empty';
            text-align: center;
            padding: 4px 0;
            color: #999;
            font-size: 14px;
            display: block;
          }
        }
        > svg {
          stroke: #e4e7ed;
          stroke-linecap: butt;
          top: -6px;
          left: 35px;
          position: absolute;
          width: 12px;
          fill: #fff;
        }
        &.bottom {
          transform-origin: center bottom;
          > svg {
            top: auto;
            bottom: -6px;
            transform: scaleY(-1);
          }
        }
        &.popup {
          opacity: 1;
          visibility: visible;
          transform: scaleY(1);
        }
        > .list {
          padding: 6px 0;
        }
      }
    `;
  }
}

class SelectInput extends Jinkela { // eslint-disable-line no-unused-vars
  get disabled() { return 'disabled'; }
  get template() {
    return `
      <input autocomplete="off" placeholder="{placeholder}" readonly="{disabled}" />
    `;
  }
  set value(value) { this.element.value = value; }
  get value() { return this.element.value; }
  focus() { this.element.focus(); }
  get styleSheet() {
    return `
      :scope {
        display: inline-block;
        flex: 1;
        order: 1;
        border: none;
        outline: none;
        padding: 0 0 0 12px;
        color: #606266;
        font-size: 14px;
        appearance: none;
        height: 28px;
        margin: 1px 0;
        background-color: transparent;
        display: inline-block;
        min-width: 40px;
        cursor: inherit;
        &::placeholder { color: #c0c4cc; };
      }
    `;
  }
}

class Select extends Jinkela {
  set disabled(value) {
    this.input.disabled = !!value;
    this.element.classList[value ? 'add' : 'remove']('disabled');
  }
  get disabled() { return this.element.classList.contains('disabled'); }

  set options(value) {
    SelectOption.from(value).to(this.dropdown.list);
  }
  get options() { return this.dropdown; }

  get text() { return this.input.value; }
  set text(text) {
    let objects = this.dropdown.getOptionObjects();
    let item = objects.find(item => item.text === text);
    if (item) this.value = item.value;
  }

  set active(value) { this.element.classList[value ? 'add' : 'remove']('active'); }
  get active() { return this.element.classList.contains('active'); }

  set placeholder(value) { this.input.placeholder = value; }
  get placeholder() { return this.input.placeholder; }

  set type(value) { this.element.dataset.type = value; }
  get type() { return this.element.dataset.type; }

  get tags() { return []; }

  set children(value) {
    this.dropdown.children = value;
    this.value = this.value;
  }
  get children() { return this.dropdown.children; }

  get dropdown() {
    let value = new SelectDropdown({ selectHandler: this.selectHandler.bind(this) });
    Object.defineProperty(this, 'dropdown', { value, configurable: true });
    return value;
  }

  selectHandler(option) {
    if (this.multiple) {
      let valueList = this.value || [];
      let index = valueList.findIndex(item => item === option.value);
      if (~index) {
        valueList.splice(index, 1);
      } else {
        valueList.push(option.value);
      }
      this.value = valueList;
    } else {
      this.value = option.value;
    }
  }

  removetag(event) {
    event.stopPropagation();
    if (!this.multiple) throw new Error('wtf');
    let { option } = event.detail;
    let valueList = this.value;
    if (!(valueList instanceof Array)) valueList = [];
    this.value = valueList.filter(value => value !== option.value);
  }

  init() {
    this.element.addEventListener('removetag', this.removetag.bind(this));
    this.element.addEventListener('click', this.click.bind(this));
    this.element.addEventListener('keydown', this.keydown.bind(this));
    this.value = this.value;
  }

  keydown(event) {
    if (this.multiple) {
      if (event.keyCode !== 8) return;
      this.tags = this.tags.slice(0, -1);
    }
  }

  get $value() {
    let value = this.multiple ? [] : void 0;
    Object.defineProperty(this, '$value', { value, configurable: true, writable: true });
    return value;
  }

  get value() { return this.$value; }
  set value(value) {
    try {
      if (this.multiple) {
        if (!(value instanceof Array)) throw new TypeError('value of JLK-SELECT[multiple] must be an array');
        let optionList = this.dropdown.updateOptionsActiveStateByValue(value);
        this.tags = optionList.map(option => new SelectTag({ option, owner: this })); // TODO: diff patch
        this.input.value = '';
      } else {
        let optionList = this.dropdown.updateOptionsActiveStateByValue([ value ]);
        if (optionList.length === 0) throw new TypeError('cannot find any option match specified value');
        this.input.value = optionList[0].text;
      }
    } catch (error) {
      this.tags = [];
      this.input.value = '';
    }
    void this.$value;
    this.$value = value;
    this.dropdown.updateRect();
  }

  click(event) {
    if (this.disabled) return;
    if (this.active) return;
    if (event.jinkela instanceof SelectTagRemove && event.jinkela.owner === this) return;
    this.input.focus();
    let { dropdown } = this;
    setTimeout(() => {
      this.active = true;
      let handler = (event) => {
        if (dropdown.element.contains(event.target)) return;
        if (event.jinkela instanceof SelectTagRemove && event.jinkela.owner === this) return;
        removeEventListener('click', handler);
        dropdown.hide();
        this.active = false;
      };
      dropdown.show(this);
      addEventListener('click', handler);
    });
  }

  get template() {
    return `
      <div class="empty">
        <!-- I don't know why, but this zero width input can fix the vertical align problem of inline-flex. -->
        <input readonly="disabled" class="zero" />
        <jkl-select-input ref="input" placeholder="Select"></jkl-select-input>
        <meta ref="tags">
      </div>
    `;
  }

  get styleSheet() {
    return `
      :scope {
        -webkit-font-smoothing: antialiased;
        box-sizing: border-box;
        width: 240px;
        min-height: 40px;
        margin-right: 1em;
        font-size: 14px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        position: relative;
        user-select: none;
        transition: .3s;
        outline: 0;
        padding: 3px 30px 3px 3px;
        display: inline-flex;
        flex-wrap: wrap;
        cursor: pointer;
        &::after {
          content: '';
          border: solid #ccc;
          border-width: 0 0 1px 1px;
          position: absolute;
          right: 10px;
          top: 13px;
          width: 7px;
          height: 7px;
          transition: transform .3s;
          transform: rotate(-45deg);
          border-color: #c0c4cc;
        }
        &:hover {
          border-color: #c0c4cc;
        }
        &.active {
          border: 1px solid #409eff;
          &::after {
            transform: translateY(5px) rotate(135deg);
          }
        }
        &.disabled {
          background-color: #f5f7fa;
          border-color: #e4e7ed;
          color: #c0c4cc;
          &, * {
            cursor: not-allowed;
          }
        }
        > input.zero {
          order: -1;
          width: 0;
          padding: 0;
          height: 28px;
          border: 0;
        }
      }
    `;
  }
}

window.Select = Select;
window.SelectOption = SelectOption;
