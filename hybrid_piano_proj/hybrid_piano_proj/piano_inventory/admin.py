from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User, Piano, Comment

admin.site.register(User, UserAdmin)
admin.site.register(Piano)
admin.site.register(Comment)
