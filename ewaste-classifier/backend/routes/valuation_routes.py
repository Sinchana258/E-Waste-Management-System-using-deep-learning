# backend/routes/valuation_routes.py
from fastapi import APIRouter
from schemas.valuation import ValueEstimateRequest, ValueEstimateResponse
from services.valuation_engine import estimate_value

router = APIRouter(
    prefix="/valuation",
    tags=["valuation"],
)


@router.post("/estimate", response_model=ValueEstimateResponse)
async def estimate_endpoint(payload: ValueEstimateRequest):
    """
    Estimate the value of an e-waste item using rule-based logic.
    """
    # estimate_value() returns a dict that matches ValueEstimateResponse
    return estimate_value(payload)
