"""Calculator tool: safely evaluates arithmetic expressions.

Uses Python's ast module to parse and evaluate only numeric operations —
never calls eval() directly, so it can't execute arbitrary code even if the
LLM passes something unexpected.
"""

import ast
import operator

_ALLOWED_OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.Pow: operator.pow,
    ast.USub: operator.neg,
    ast.UAdd: operator.pos,
    ast.Mod: operator.mod,
}


def _eval_node(node):
    if isinstance(node, ast.Constant):
        if isinstance(node.value, (int, float)):
            return node.value
        raise ValueError("Only numeric constants are allowed")
    if isinstance(node, ast.BinOp):
        op_fn = _ALLOWED_OPERATORS.get(type(node.op))
        if op_fn is None:
            raise ValueError(f"Operator {type(node.op).__name__} is not allowed")
        return op_fn(_eval_node(node.left), _eval_node(node.right))
    if isinstance(node, ast.UnaryOp):
        op_fn = _ALLOWED_OPERATORS.get(type(node.op))
        if op_fn is None:
            raise ValueError(f"Operator {type(node.op).__name__} is not allowed")
        return op_fn(_eval_node(node.operand))
    raise ValueError(f"Unsupported expression: {ast.dump(node)}")


def run_calculator(expression: str) -> str:
    """Evaluate a plain arithmetic expression like '12 * (4 + 3)'."""
    try:
        parsed = ast.parse(expression, mode="eval").body
        result = _eval_node(parsed)
        return str(result)
    except Exception as exc:
        return f"Could not evaluate expression '{expression}': {exc}"