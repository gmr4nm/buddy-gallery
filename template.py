import webapp2
import jinja2
import os
from google.appengine.api import images

template_dir = os.path.join(os.path.dirname(__file__))
jinja_environment = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir),
                               autoescape = True)


class Handler(webapp2.RequestHandler): 
    """Basic Handler; will be inherited by more specific path Handlers"""
    def write(self, *a, **kw):
        "Write small strings to the website"
        self.response.out.write(*a, **kw)  

    def render_str(self, template, **params):  
        "Render jija2 templates"
        t = jinja_environment.get_template(template)
        return t.render(params)   
    
    def render(self, template, **kw):
        "Write the jinja template to the website"
        self.write(self.render_str(template, **kw))

class Main(Handler):
    """Basic Handler for Mainpage"""
    def get(self):
        self.render("main.html")
        
class Working_collie(Handler):
    """Basic Handler for working_collie Page"""
    def get(self):
        self.render("working_collie.html")

class Popular_buddy(Handler):
    """Basic Handler for popular_buddy Page"""
    def get(self):
        self.render("popular_buddy.html")

class Master_of_disguise(Handler):
    """Basic Handler for master_of_disguise.html"""
    def get(self):
        self.render("master_of_disguise.html")
        
router = [('/', Main),
          ('/working_collie', Working_collie),
          ('/popular_buddy', Popular_buddy),
          ('/master_of_disguise', Master_of_disguise)]

app = webapp2.WSGIApplication(router,debug=True)
