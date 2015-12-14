import urllib
import urllib2
import webapp2
import jinja2
import os
from google.appengine.api import images
from google.appengine.ext import db
from google.appengine.api import users

template_dir = os.path.join(os.path.dirname(__file__))
jinja_environment = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir),
                               autoescape = True)
class Greeting(db.Model):
    """Class for Guest_post post defined as DB entry with content and date"""
    content = db.StringProperty(multiline=True, indexed=False)
    date = db.DateTimeProperty(auto_now_add=True)

def _GuestbookKey():
  """Constructs a Datastore key for a Guestbook entity with guestbook_name."""
  return db.Key.from_path('Guestbook', 'default_guestbook')

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


class Guestbook(webapp2.RequestHandler):
    

  def get(self):  
    """Handle GET requests."""
    error = self.request.get('error')
    greetings_query = Greeting.all().ancestor(
        _GuestbookKey()).order('-date')
    greetings = greetings_query.fetch(10)

    template_values = {
        'greetings': greetings
    }

    template = jinja_environment.get_template('guestbook.html')
    self.response.out.write(template.render(template_values, error=error))

class Sign(Handler):
        

  def post(self):  
    """Handle POST requests."""
    greeting = Greeting(parent=_GuestbookKey())

    if self.request.get('content') != '' and str.isspace(str(self.request.get('content'))) == False:
        connection = urllib.urlopen("http://www.wdyl.com/profanity?q="+str(self.request.get('content')))
        output = connection.read()
        connection.close()
        if "true" in output:
            '''Profanity checker'''
            greeting.content = "(Content was blocked by the profanity filter)"
            greeting.put()
            self.redirect("/guestbook")
        else:
            greeting.content = self.request.get('content')
            greeting.put()
            self.redirect('/guestbook')

        import time
        time.sleep(.1)
        self.redirect('/guestbook')
    else:
        self.redirect('/guestbook?error=True')
        
router = [('/', Main),
          ('/working_collie', Working_collie),
          ('/popular_buddy', Popular_buddy),
          ('/master_of_disguise', Master_of_disguise),
          ('/guestbook', Guestbook),
          ('/sign', Sign)]

app = webapp2.WSGIApplication(router,debug=True)
