# TODO: Implement health score calculator
# Generate financial health score using ML model

def calculate_health_score(features):
    """
    Calculate financial health score (0-100).
    """
    # TODO: Use ML model for scoring
    # Simple weighted calculation for now
    expense_ratio = features.get('expense_ratio', 0)
    savings_ratio = features.get('savings_ratio', 0)
    debt_ratio = features.get('debt_ratio', 0)

    # Higher score for lower expense ratio, higher savings, lower debt
    score = (1 - expense_ratio) * 40 + savings_ratio * 40 + (1 - debt_ratio) * 20
    return max(0, min(100, score))