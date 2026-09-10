from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from apps.leads.models import Lead
from .models import EstimatorSubmission, ChatMessage
from .serializers import CalculateEstimateInputSerializer, ChatQuerySerializer
from .services import calculate_construction_estimate, query_construction_ai


class CostEstimatorCalculateView(APIView):
    """
    Public interactive calculator returning an itemized GHS cost projection.
    Automatically captures a CRM lead if contact credentials are submitted.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CalculateEstimateInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        estimate = calculate_construction_estimate(
            project_category=data['project_category'],
            floor_area_sqm=data['floor_area_sqm'],
            floors=data['floors'],
            finish_quality=data['finish_quality']
        )

        lead = None
        contact_name = data.get('contact_name', '').strip()
        contact_phone = data.get('contact_phone', '').strip()
        contact_email = data.get('contact_email', '').strip()

        if contact_name and (contact_phone or contact_email):
            lead = Lead.objects.create(
                full_name=contact_name,
                email=contact_email or "not_provided@eshag.construction",
                phone=contact_phone,
                inquiry_type=Lead.InquiryType.REQUEST_A_QUOTE,
                project_type=data['project_category'].title(),
                estimated_budget=f"GHS {estimate['total_low']:,} - {estimate['total_high']:,}",
                message=(
                    f"Generated via Online Cost Estimator:\n"
                    f"Category: {data['project_category']}\n"
                    f"Area: {data['floor_area_sqm']} sqm\n"
                    f"Floors: {data['floors']}\n"
                    f"Finish: {data['finish_quality']}"
                ),
                source=Lead.Source.WEBSITE,
                status=Lead.Status.NEW,
                priority=Lead.Priority.HIGH
            )

        submission = EstimatorSubmission.objects.create(
            project_category=data['project_category'],
            floor_area_sqm=data['floor_area_sqm'],
            floors=data['floors'],
            finish_quality=data['finish_quality'],
            estimated_materials_cost=estimate['materials_cost'],
            estimated_labor_cost=estimate['labor_cost'],
            estimated_management_cost=estimate['management_cost'],
            estimated_total_low=estimate['total_low'],
            estimated_total_high=estimate['total_high'],
            lead=lead,
            contact_name=contact_name,
            contact_email=contact_email,
            contact_phone=contact_phone
        )

        return Response({
            "estimate_id": str(submission.id),
            "project_category": data['project_category'],
            "floor_area_sqm": data['floor_area_sqm'],
            "floors": data['floors'],
            "finish_quality": data['finish_quality'],
            "breakdown": {
                "currency": "GHS",
                "estimated_materials": float(estimate['materials_cost']),
                "estimated_labor": float(estimate['labor_cost']),
                "estimated_management": float(estimate['management_cost']),
                "estimated_total_low": float(estimate['total_low']),
                "estimated_total_high": float(estimate['total_high']),
            },
            "disclaimer": estimate['disclaimer'],
            "lead_captured": lead is not None
        }, status=status.HTTP_200_OK)


class AIAssistantChatView(APIView):
    """
    Public conversational endpoint powered by Gemini AI with construction domain grounding.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ChatQuerySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        session_id = serializer.validated_data['session_id']
        user_message = serializer.validated_data['message']

        # Log user query
        ChatMessage.objects.create(
            session_id=session_id,
            sender=ChatMessage.Sender.USER,
            content=user_message
        )

        reply_text = query_construction_ai(user_message=user_message)

        # Log assistant response
        ChatMessage.objects.create(
            session_id=session_id,
            sender=ChatMessage.Sender.ASSISTANT,
            content=reply_text
        )

        return Response({
            "session_id": session_id,
            "response": reply_text
        }, status=status.HTTP_200_OK)