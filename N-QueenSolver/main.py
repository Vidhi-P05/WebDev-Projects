from flask import Flask, render_template, request

app = Flask(__name__)

def solve_n_queens(n):
    def is_safe(board, row, col):
        for i in range(col):
            if board[row][i] == 1:
                return False
        for i, j in zip(range(row, -1, -1), range(col, -1, -1)):
            if board[i][j] == 1:
                return False
        for i, j in zip(range(row, len(board)), range(col, -1, -1)):
            if board[i][j] == 1:
                return False
        return True

    def solve(board, col):
        if col >= n:
            # Convert the board into a list of lists for rendering in HTML
            solutions.append([['Q' if cell == 1 else '.' for cell in row] for row in board])
            return
        for i in range(n):
            if is_safe(board, i, col):
                board[i][col] = 1
                solve(board, col + 1)
                board[i][col] = 0

    solutions = []
    board = [[0] * n for _ in range(n)]
    solve(board, 0)
    return solutions


@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        try:
            n = int(request.form["n"])
            solutions = solve_n_queens(n)
            return render_template("index.html", n=n, solutions=solutions, total=len(solutions))
        except ValueError:
            return render_template("index.html", error="Please enter a valid number.")
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)