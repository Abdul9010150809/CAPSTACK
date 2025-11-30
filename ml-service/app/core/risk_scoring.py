# TODO: Implement risk scoring using ML model
# Load trained model and predict risk level

def calculate_risk_level(features):
    """
    Calculate financial risk level based on features.
    Returns risk level and insights.
    """
    # TODO: Load model from risk_model.pkl and predict
    # For now, simple rule-based scoring
    expense_ratio = features.get('expense_ratio', 0)
    debt_ratio = features.get('debt_ratio', 0)

    if expense_ratio > 0.8 or debt_ratio > 0.5:
        risk_level = 'high'
        insights = ['High expense ratio indicates potential financial stress', 'Consider reducing debt']
    elif expense_ratio > 0.6 or debt_ratio > 0.3:
        risk_level = 'medium'
        insights = ['Moderate risk, monitor expenses closely']
    else:
        risk_level = 'low'
        insights = ['Good financial health']

    return {
        'risk_level': risk_level,
        'insights': insights
    }