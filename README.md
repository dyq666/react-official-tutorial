## 简介
React 官方的新手教程，通过实现一个简单的[井字棋游戏](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)来入门 React。

## 核心知识点
### JSX
React 中使用了一种特殊的语法（叫做 JSX）来构建视图层，例如下面 `render` 方法中 `return` 的代码片段。build 时这些 JSX 语法会被转化成 `React.createElement`。

```
class Demo extends React.Component {
    render() {
        return (
            <div>
                <h1>Demo</h1>
            </div>
        );
    }
}
```

JSX 语法中可以用 `{}` 包裹 JS 代码。
```
class Demo extends React.Component {
    render() {
        const demo = <h1>Demo</h1>;
        const text = "Bella";
        return (
            <div>
                {demo}
                <p>{text}</p>
            </div>
        );
    }
}
```
