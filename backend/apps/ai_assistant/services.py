import os
import json
import urllib.request
import urllib.error
from decimal import Decimal
from apps.core.models import CompanySettings


def calculate_construction_estimate(project_category, floor_area_sqm, floors, finish_quality):
    """
    Deterministic baseline cost modeling in GHS based on construction sector rates.
    """
    area = float(floor_area_sqm)
    num_floors = max(1, int(floors))

    # Base price per square meter in GHS
    base_rate_map = {
        'residential': 3800.0,
        'commercial': 4500.0,
        'renovation': 2200.0,
        'project_management': 800.0,
    }
    base_sqm_cost = base_rate_map.get(project_category, 3500.0)

    # Multipliers
    quality_multipliers = {
        'standard': 1.0,
        'premium': 1.35,
        'luxury': 1.80,
    }
    quality_multiplier = quality_multipliers.get(finish_quality, 1.0)

    # Structural multi-story reinforcement factor
    height_factor = 1.0 + ((num_floors - 1) * 0.12)

    total_base = area * base_sqm_cost * quality_multiplier * height_factor

    # Sector standard allocations
    materials_cost = total_base * 0.55
    labor_cost = total_base * 0.30
    management_cost = total_base * 0.15

    # Estimated range (+/- 12%)
    total_low = total_base * 0.88
    total_high = total_base * 1.12

    return {
        "materials_cost": Decimal(str(round(materials_cost, 2))),
        "labor_cost": Decimal(str(round(labor_cost, 2))),
        "management_cost": Decimal(str(round(management_cost, 2))),
        "total_low": Decimal(str(round(total_low, 2))),
        "total_high": Decimal(str(round(total_high, 2))),
        "disclaimer": (
            "This estimate is an indicative feasibility projection based on standard square meter rates. "
            "Actual contractual pricing depends on site topography, architectural working drawings, "
            "soil condition tests, and final material selections."
        )
    }


def query_construction_ai(user_message, conversation_history=None):
    """
    Queries Google Gemini API with technical construction context.
    Falls back gracefully to guided domain responses if API key is not configured.
    """
    api_key = os.environ.get('GEMINI_API_KEY', '').strip()
    company = CompanySettings.objects.first()
    
    phone = company.primary_phone if company else "059 953 5884"
    email = company.email if company else "info@eshag.construction"

    system_instruction = (
        "You are the official AI Technical Assistant for 'ESHAG Building and Construction', "
        "a premier construction and civil engineering firm operating in Ghana. "
        "Your role is to answer questions about residential construction, commercial facilities, "
        "renovations, remodeling, project timelines, materials, and permitting feasibility. "
        "Always maintain a professional, knowledgeable, and helpful tone. "
        "Provide constructive engineering insight. "
        f"For custom quotations or site inspections, invite the client to submit a quote request on the website "
        f"or contact the engineering office directly via phone at {phone} or email at {email}."
    )

    if not api_key:
        return (
            "Thank you for contacting ESHAG Building and Construction. "
            "Our team handles full residential builds, commercial developments, structural renovations, "
            "and turnkey civil projects across Ghana. "
            f"For project estimation or engineering consultations, please reach out directly at {phone} "
            f"or submit your drawings via our 'Request a Quote' page."
        )

    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        
        prompt_text = f"{system_instruction}\n\nClient: {user_message}\nESHAG Assistant:"
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt_text}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.4,
                "maxOutputTokens": 500,
            }
        }

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'},
            method='POST'
        )

        with urllib.request.urlopen(req, timeout=10) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            candidates = res_data.get('candidates', [])
            if candidates:
                parts = candidates[0].get('content', {}).get('parts', [])
                if parts:
                    return parts[0].get('text', '').strip()

        return (
            "We have noted your construction query. Please submit your project details via our "
            "Quotation page or contact our engineering desk directly."
        )
    except Exception:
        return (
            "Thank you for reaching out to ESHAG Building and Construction. "
            f"Our engineers specialize in residential and commercial developments. You can connect with our team directly at {phone}."
        )