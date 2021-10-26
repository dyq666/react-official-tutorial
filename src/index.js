import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Board(props) {
    // 生成三行三列 button 组件。
    // `rows` & `cols` 不会有插入/删除/排序等改变元素顺序的操作，
    // 因此可以用索引作为 key。
    const rows = new Array(3).fill(0).map((_, row) => {
        const cols = new Array(3).fill(0).map((_, col) => {
            const idx = (3 * row) + col;
            return (
                <button
                    key={idx}
                    className="square"
                    onClick={() => props.onClick(idx)}
                >
                    {props.squares[idx]}
                </button>
            );
        });
        return <div className="board-row" key={row}>{cols}</div>;
    });

    return <div>{rows}</div>;
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),  // 这个数组代表初始棋盘，即全空状态。
            }],
            stepNumber: 0,
        };
    }

    render() {
        const squares = this.state.history[this.state.stepNumber].squares;
        const winner = calculateWinner(squares);
        const status = winner ? `Winner: ${winner}` : `Next player: ${this.getNextMarker()}`;

        // `this.state.history` 不会进行排序，只会在末尾插入，
        // 只会在末尾删除，不会改变现有元素的顺序，因此可以用索引作为 key。
        const moves = this.state.history.map((_, idx) => {
            const desc = idx ? `Go to move #${idx}` : "Go to game start";
            return (
                <li key={idx}>
                    <button onClick={() => this.setState({stepNumber: idx})}>
                        {desc}
                    </button>
                </li>
            );
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }

    handleClick(i) {
        // 历史记录有个默认的初始状态，因此总记录比步数多一
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const squares = history[history.length - 1].squares.slice();

        // 方格中有符号或者游戏有胜者，禁止点击
        if (squares[i] || calculateWinner(squares)) {
            return;
        }
        squares[i] = this.getNextMarker();

        this.setState({
            // `concat` 会返回的是 copy
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: this.state.stepNumber + 1,
        });
    }

    getNextMarker() {
        // 偶数步骤是 'X'，奇数步骤是 'O'。
        return (this.state.stepNumber % 2) === 0 ? 'X' : 'O';
    }
}

function calculateWinner(squares) {
    /**
     * 如果有胜者返回 'X' 或者 'O'，还没分出胜负返回 null。
     */
    // 三横三竖两对角线，八种胜利方式
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    // 判断 `squares` 是否满足其中一种胜利方式
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a]
            && squares[a] === squares[b]
            && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
