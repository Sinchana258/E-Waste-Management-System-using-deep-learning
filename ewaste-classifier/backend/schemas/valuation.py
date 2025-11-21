# backend/schemas/valuation.py
from typing import List, Literal, Optional
from pydantic import BaseModel, Field


class ComponentShare(BaseModel):
    name: str
    # share of value or weight (0–1)
    percentage: float = Field(ge=0, le=1)


class ValueEstimateRequest(BaseModel):
    # broad device type
    category: Literal["mobile", "laptop", "tv", "tablet", "accessory", "other"]

    # current condition
    condition: Literal["working", "repairable", "dead"]

    # age of the device in years
    age_years: float = Field(ge=0)

    # simple brand tier
    brand_tier: Literal["tier1", "tier2", "local"] = "tier2"

    # optional approximate weight in kg
    weight_kg: Optional[float] = Field(default=None, ge=0)

    # optional component breakdown
    components: Optional[List[ComponentShare]] = None

    # city / region if you want to vary prices later
    location: Optional[str] = None


class ValueBreakdown(BaseModel):
    base_price: float
    condition_multiplier: float
    brand_multiplier: float
    age_factor: float
    weight_factor: float
    component_bonus: float
    final_value: float
    currency: str = "INR"


class ValueEstimateResponse(BaseModel):
    estimated_value: float
    currency: str = "INR"
    breakdown: ValueBreakdown
