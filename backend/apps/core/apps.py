from django.apps import AppConfig


def patched_base_context_copy(self):
    obj = object.__new__(self.__class__)
    obj.__dict__.update(self.__dict__)
    if hasattr(self, 'dicts'):
        obj.dicts = self.dicts[:]
    return obj


def patched_context_copy(self):
    obj = object.__new__(self.__class__)
    obj.__dict__.update(self.__dict__)
    if hasattr(self, 'dicts'):
        obj.dicts = self.dicts[:]
    return obj


def patched_request_context_copy(self):
    obj = object.__new__(self.__class__)
    obj.__dict__.update(self.__dict__)
    if hasattr(self, 'dicts'):
        obj.dicts = self.dicts[:]
    return obj


class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.core'

    def ready(self):
        from django.template import context
        context.BaseContext.__copy__ = patched_base_context_copy
        context.Context.__copy__ = patched_context_copy
        context.RequestContext.__copy__ = patched_request_context_copy