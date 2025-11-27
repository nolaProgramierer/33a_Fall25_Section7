from rest_framework import serializers
from .models import Piano, User, Comment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email" ]


class PianoSerializer(serializers.ModelSerializer):
    # Use PrimaryKeyRelatedField for POST requests (creating or updating Piano)
    owner = serializers.PrimaryKeyRelatedField(
                            queryset=User.objects.all(), 
                            required=True
                            )
    # Return full user details for GET requests (not for creating an object)
    owner_detail = UserSerializer(source='owner', read_only=True)

    class Meta:
        model = Piano
        fields = [
                  "id", 
                  "brand", 
                  "price", 
                  "size", 
                  "imageUrl", 
                  "owner", 
                  "owner_detail" 
                  ]
    


class CommentSerializer(serializers.ModelSerializer):
    # Post request
    piano = serializers.PrimaryKeyRelatedField(
                                    queryset=Piano.objects.all(), 
                                    required=True
                                   )
    # Get request
    piano_detail = PianoSerializer(source='piano', read_only=True)

    commenter = serializers.PrimaryKeyRelatedField(
                                    queryset=User.objects.all(), 
                                    required=True)
    commenter_detail = UserSerializer(source='commenter', read_only=True)

    class Meta:
        model = Comment
        fields = [
                  "id",
                  "text", 
                  "created_at", 
                  "piano", 
                  "piano_detail",
                  "commenter",
                  "commenter_detail"
                  ]
        read_only_fields = ["created_at"]


