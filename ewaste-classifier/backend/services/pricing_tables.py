CATEGORY_BASE_PRICE = {
    "laptop": 25000,
    "mobile_phone": 12000,
    "tablet": 15000,
    "charger": 300,
    "monitor": 7000,
    "keyboard": 500,
    "printer": 8000,
}

SCRAP_RATE_PER_KG = {
    "laptop": 250,         # ₹ per kg
    "mobile_phone": 400,
    "tablet": 300,
    "charger": 150,
    "monitor": 200,
    "printer": 180,
}

CONDITION_FACTORS = {
    "working": 1.0,
    "repairable": 0.6,
    "dead": 0.2,
}

AGE_DEPRECIATION_PER_YEAR = {
    "laptop": 0.18,
    "mobile_phone": 0.25,
    "tablet": 0.22,
    "monitor": 0.15,
    "printer": 0.20,
}
