from django.contrib import admin
from .models import Professor, Vote, Comment

@admin.register(Professor)
class ProfessorAdmin(admin.ModelAdmin):
    list_display = ['name', 'subject', 'total_votes', 'average_score', 'created_at']
    list_filter = ['subject', 'created_at']
    search_fields = ['name', 'subject']
    readonly_fields = ['created_at', 'total_votes', 'average_score']
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('name', 'subject', 'description')
        }),
        ('Image', {
            'fields': ('photo',)
        }),
        ('Statistiques', {
            'fields': ('total_votes', 'average_score', 'created_at'),
            'classes': ('collapse',)
        }),
    )
    
    def total_votes(self, obj):
        return obj.total_votes
    total_votes.short_description = "Nombre de votes"
    
    def average_score(self, obj):
        return f"{obj.average_score}/5" if obj.average_score > 0 else "Aucun vote"
    average_score.short_description = "Score moyen"


@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ['professor', 'score', 'score_stars', 'ip_address', 'timestamp', 'has_comment']
    list_filter = ['score', 'timestamp', 'professor']
    search_fields = ['professor__name', 'ip_address', 'comment']
    readonly_fields = ['timestamp']
    date_hierarchy = 'timestamp'
    
    def score_stars(self, obj):
        return '⭐' * obj.score
    score_stars.short_description = "Étoiles"
    
    def has_comment(self, obj):
        return bool(obj.comment)
    has_comment.boolean = True
    has_comment.short_description = "Commentaire"
    
    def has_change_permission(self, request, obj=None):
        # Empêcher la modification des votes pour préserver l'intégrité
        return False


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['professor_name', 'content_preview', 'is_anonymous', 'created_at']
    list_filter = ['is_anonymous', 'created_at']
    search_fields = ['vote__professor__name', 'content']
    readonly_fields = ['created_at', 'vote']
    
    def professor_name(self, obj):
        return obj.vote.professor.name
    professor_name.short_description = "Professeur"
    
    def content_preview(self, obj):
        return obj.content[:50] + "..." if len(obj.content) > 50 else obj.content
    content_preview.short_description = "Aperçu du commentaire"