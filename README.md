## 简介
[React 官方的新手教程](https://reactjs.org/tutorial/tutorial.html)，通过实现一个简单的[井字棋游戏](https://codepen.io/gaearon/pen/gWWZgR)来入门 React。

## React 核心知识点

### JSX
1. React 中使用特殊的语法（叫做 JSX）来构建视图层，比如下面的 `<h1>Demo</h1>`。
2. build 时，JSX 会被转化成 `React.createElement`，因此可以将 JSX 赋值给变量。
3. JSX 中可以用 `{}` 包裹 JS 代码。
```js
class Demo extends React.Component {
    render() {
        const demo = <h1>Demo</h1>;
        const text = "Bella";
        return (
            <div>
                <h1>Demo</h1>
                {demo}
                <p>{text}</p>
            </div>
        );
    }
}
```
1. 如果 `{}` 中包裹的是列表，列表最终会展示每一个元素，不需要手动遍历。
2. 渲染列表时，需要给列表中每个组件提供一个 `key`，这个 `key` 就是该组件的 UID，React 会根据 UID 决定如何重新渲染列表。如果不提供 `key`，那么 React 会默认使用 idx 作为 `key`，如果主动将 idx 设为 key，虽然能屏蔽掉 `warning`，但实际问题依然在。使用 idx 作为 `key` 的问题是，排序之类的操作会打乱 idx，使得 idx 不再具备 UID 的功能，因此尽量不要使用 idx 作为 `key`，真要使用也要保证列表中已有的组件的 idx 不会被改变。
```js
class Demo extends React.Component {
    render() {
        // 控制台会给一个 Warning: ... should have a unique "key" prop.
        const paragraphs = new Array(3).fill(0).map(
            (_, idx) => <p>{`p1: ${idx}`}</p>
        );
        // 一般来说会用数据库给的 id 作为 key，这里就先用 idx 了。
        const paragraphs2 = new Array(3).fill(0).map(
            (_, idx) => <p key={idx}>{`p2: ${idx}`}</p>
        );
        return (
            <div>
                {paragraphs}
                {paragraphs2}
            </div>
        );
    }
}
```

### 组件中的私有数据
1. 私有数据在 `constructor` 构造函数中初始化，统一放在 `this.state` 中。
2. 构造函数第一步要 `super(props)`。
3. 使用 `this.setState` 修改私有数据，通过此方法修改才能触发重新渲染。
```js
class Demo extends React.Component {
    /**
     * 点击按钮，按钮文字从 Bella 变为 Kira。
     */
    constructor(props) {
        super(props);
        this.state = {
            name: "Bella",
        };
    }

    render() {
        return (
            <div>
                <button onClick={() => this.setState({name: "Kira"})}>
                    {this.state.name}
                </button>
            </div>
        );
    }
}
```

### 组件间的信息交流

#### 父组件向子组件传递数据
1. 父组件创建子组件时，直接将数据写在子组件属性中，子组件通过 `this.props` 获取数据。
```js
class Child extends React.Component {
    render() {
        return (
            <div>{this.props.value}</div>
        );
    }
}

class Parent extends React.Component {
    render() {
        return (
            <div>
                <Child value={1} />
                <Child value={2} />
            </div>
        );
    }
}
```

#### 子组件向父组件传递数据
1. 父组件向子组件传递一个函数，子组件通过调用函数来传递数据。
```js
/**
 * 用 `Child` 中的 input 来修改 `Parent` 中的 h1。
 */ 
class Child extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: "",
        };
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        return (
            <input
                type="text" 
                onChange={this.handleChange}
                value={this.state.inputValue}
            />
        );
    }

    handleChange(e) {
        this.setState({inputValue: e.target.value});
        this.props.changeName(e.target.value);
    }
}

class Parent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "Bella",
        };
    }

    render() {
        return (
            <div>
                <h1>{this.state.name}</h1>
                <Child changeName={(name) => this.setState({name: name})} />
            </div>
        );
    }
}
```


### 使用 immutable 对象
1. React 需要根据数据是否变化来判断是否重新渲染组件，比如在调用 `setState` 时。
2. 如果对象是 immutable，那么只要引用对象与前一个不同就说明改变了。而如果对象是 mutable，那么需要从整个对象树中找出先前的复制品，再进行比较。
```js
class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numbers: [],
        };
    }

    render() {
        return (
            <div>
                <button onClick={() => this.handleClick()}>按</button>
                {this.state.numbers.map((value, idx) => <p key={idx}>{value}</p>)}
            </div>
        );
    }

    handleClick() {
        // 这里先复制了一份数组，再对复制的数组进行操作，保证 immutable。
        const numbers = this.state.numbers.slice();
        numbers.push(Math.random());
        this.setState({
            numbers: numbers,
        });
    }
}
```

### 函数式组件
1. 把类组件变成函数组件，就是将 `render` 函数抽出来变成函数组件，参数是 `props`。
```js
/**
 * `Child2` 就是将 `Child` 变成函数式组件。
 */ 
class Child extends React.Component {
    render() {
        return (
            <h1>{this.props.name}</h1>
        );
    }
}

function Child2(props) {
    return (
        <h1>{props.name}</h1>
    );
}

class Parent extends React.Component {
    render() {
        return (
            <div>
                <Child name={"Bella"} />
                <Child2 name={"Bella"} />
            </div>
        );
    }
}
```
