import os
import zipfile
import io
import requests


current_directory = os.path.dirname(os.path.abspath(__file__))


def update_base_transit():
    url = 'http://www.rtd-denver.com/GoogleFeeder/google_transit.zip'
    request = requests.get(url)
    z = zipfile.ZipFile(io.BytesIO(request.content))
    z.extractall(path=os.path.join(current_directory, '_working_directory/'))
