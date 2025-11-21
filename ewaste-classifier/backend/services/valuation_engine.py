# backend/services/valuation_engine.py
from schemas.valuation import ValueEstimateRequest


# --- RULE TABLES ---

CATEGORY_BASE_PRICE = {
    "mobile": 250.0,   # base scrap / resale value in INR
    "laptop": 800.0,
    "tv": 500.0,
    "tablet": 400.0,
    "accessory": 100.0,
    "other": 150.0,
}

CONDITION_MULTIPLIER = {
    "working": 1.4,     # more value if device is working
    "repairable": 1.0,  # normal
    "dead": 0.6,        # only parts/scrap
}

BRAND_MULTIPLIER = {
    "tier1": 1.1,   # Apple, Samsung, Dell, etc.
    "tier2": 1.0,   # mid-range brands
    "local": 0.9,   # unbranded / very low-end
}

REFERENCE_WEIGHT = {
    "mobile": 0.18,   # in kg (approx)
    "laptop": 2.0,
    "tv": 8.0,
    "tablet": 0.5,
    "accessory": 0.1,
    "other": 1.0,
}


def _age_factor(age_years: float,
                discount_per_year: float = 0.08,
                max_discount: float = 0.5) -> float:
    """
    Age reduces value up to a maximum discount.
    Example: 3 years * 8% = 24% discount => factor = 0.76
    """
    discount = min(age_years * discount_per_year, max_discount)
    return 1.0 - discount


def _weight_factor(category: str, weight_kg: float | None) -> float:
    """
    Adjust value based on how heavy/light it is compared to the reference.
    If weight is None, we don't adjust.
    """
    if weight_kg is None:
        return 1.0

    ref = REFERENCE_WEIGHT.get(category, REFERENCE_WEIGHT["other"])
    ratio = max(weight_kg / ref, 0.2)  # avoid too small values
    # use a soft exponent so it doesn't explode
    return ratio ** 0.7


def _component_bonus(components) -> float:
    """
    Optional extra bonus based on valuable components.
    Example: if user says "battery:0.3, motherboard:0.4, screen:0.3",
    and we consider motherboard/screen more valuable.
    """
    if not components:
        return 0.0

    bonus = 0.0
    for c in components:
        name = c.name.lower()
        pct = c.percentage
        if "motherboard" in name or "pcb" in name:
            bonus += 80 * pct
        elif "screen" in name or "display" in name:
            bonus += 60 * pct
        elif "battery" in name:
            bonus += 40 * pct
        else:
            bonus += 20 * pct
    return bonus


def estimate_value(request: ValueEstimateRequest) -> dict:
    """
    Main rule-based valuation function.
    Returns a dict that matches ValueEstimateResponse.
    """

    category = request.category
    condition = request.condition
    brand_tier = request.brand_tier

    base_price = CATEGORY_BASE_PRICE.get(category, CATEGORY_BASE_PRICE["other"])
    condition_mult = CONDITION_MULTIPLIER[condition]
    brand_mult = BRAND_MULTIPLIER[brand_tier]
    age_fact = _age_factor(request.age_years)
    weight_fact = _weight_factor(category, request.weight_kg)
    comp_bonus = _component_bonus(request.components)

    # core multiplicative model
    value = base_price * condition_mult * brand_mult * age_fact * weight_fact
    value += comp_bonus  # add bonus linearly

    final_value = max(round(value, 2), 0.0)

    breakdown = {
        "base_price": round(base_price, 2),
        "condition_multiplier": condition_mult,
        "brand_multiplier": brand_mult,
        "age_factor": round(age_fact, 3),
        "weight_factor": round(weight_fact, 3),
        "component_bonus": round(comp_bonus, 2),
        "final_value": final_value,
        "currency": "INR",
    }

    return {
        "estimated_value": final_value,
        "currency": "INR",
        "breakdown": breakdown,
    }
