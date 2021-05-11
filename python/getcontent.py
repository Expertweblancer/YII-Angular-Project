import cookielib
import urllib
import urllib2

url = 'http://srv.shipme.yii/user/security/login'
values = {'login-form[login]' : 'jacek',
          'password-clear' : 'Combination',
          'password-password' : 'mypassword' }

data = urllib.urlencode(values)
cookies = cookielib.CookieJar()
print data
opener = urllib2.build_opener(
    urllib2.HTTPRedirectHandler(),
    urllib2.HTTPHandler(debuglevel=0),
    urllib2.HTTPSHandler(debuglevel=0),
    urllib2.HTTPCookieProcessor(cookies))

response = opener.open(url, data)
the_page = response.read()
http_headers = response.info()
# The login cookies should be contained in the cookies variable