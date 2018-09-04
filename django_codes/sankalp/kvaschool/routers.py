class SankalpKVARouter(object):
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'kvaschool':
            return 'sankalp_kva'
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'kvaschool':
            return 'sankalp_kva'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        if obj1._meta.app_label == 'kvaschool' or obj2._meta.app_label == 'kvaschool':
            return True
        return None

    def allow_syncdb(self, db, model):

        if db == 'sankalp_kva':
            return model._meta.app_label == 'kvaschool'
        elif model._meta.app_label == 'kvaschool':
            return False
        return None
