from django.db.models import Q
from knox.auth import TokenAuthentication
from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from application.models import Challenges, Course
from authentification.models import Users
from authentification.serializers import UserSerializer
from .serializers import ChallengeSerialize, CourseSerialize, GroupSerialize


class CreateChallenge(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    serializer_class = ChallengeSerialize

    def get_permissions(self):
        return [permissions.IsAdminUser(), permissions.IsAuthenticated()]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        challenge = serializer.save()
        return Response(
            {
                "challenge": ChallengeSerialize(challenge, context=self.get_serializer_context()).data
            }
        )


class CreateGroup(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    serializer_class = GroupSerialize

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        group = serializer.save(user=request.user)

        return Response(
            {
                "group": GroupSerialize(group, context=self.get_serializer_context()).data
            }
        )


class CreateCourse(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    serializer_class = CourseSerialize

    def get_permissions(self):
        return [permissions.IsAdminUser(), permissions.IsAuthenticated()]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        course = serializer.save(owner=request.user)

        return Response(
            {
                "course": CourseSerialize(course, context=self.get_serializer_context()).data
            }
        )

    def pre_save(self, obj):
        obj.owner_id = self.request.user


class CourseFetch(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    serializer_class = CourseSerialize

    def get_queryset(self):
        if self.request.user.has_perm(self):
            return Course.objects.filter(owner_id=self.request.user)
        else:
            return Course.objects.filter(enrollment__user_id=self.request.user)


class ChallengeFetch(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    serializer_class = ChallengeSerialize

    def get_queryset(self):
        if self.request.user.has_perm(self):
            return Challenges.objects.filter(course__owner_id=self.request.user)
        else:
            criterion1 = Q(course__enrollment__user_id=self.request.user)
            criterion2 = Q(is_visible=True)
            return Challenges.objects.filter(criterion1 & criterion2)


class FetchUsersNotInGroup(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    serializer_class = UserSerializer

    def get_queryset(self):
        challenge_id = self.request.POST.get('challenge_id')
        course_id = self.request.POST.get('course_id')

        criterion1 = Q(enrollment__course__course_id=course_id)
        criterion2 = Q(groups__challenge__challenge_id=challenge_id)

        list1 = list(Users.objects.filter(criterion1).values_list('user_id', flat=True))
        list2 = list(Users.objects.filter(criterion2).values_list('user_id', flat=True))

        list3 = list(filter(lambda x: x not in list2, list1))

        return Users.objects.filter(user_id__in=list3)