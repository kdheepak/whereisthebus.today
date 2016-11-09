from __future__ import print_function
import pandas as pd

from google.transit import gtfs_realtime_pb2
import requests
import pandas as pd
from io import BytesIO
import zipfile
import os
import os.path
import datetime
import math

import pandas as pd
import json

def get_gtfs_data(force=False):
    url = 'http://www.rtd-denver.com/GoogleFeeder/google_transit.zip'
    headers_file = 'google_feeder_headers.txt'

    last_modified = requests.head(url).headers['Date']
    rerequest = False

    if not os.path.isfile(headers_file):
        rerequest = True
    else:
        with open(headers_file) as f:
            f_line = f.read()
            if last_modified not in f_line:
                print("File are not the same, submit rerequest")
                if force:
                    rerequest=True
            else:
                print("File unchanged!")
                if not os.path.isfile('stops.txt') or not os.path.isfile('trips.txt'):
                    rerequest = True
                    print("Files missing")

    if rerequest:
        print("Re-requesting data")
        request = requests.get(url)
        z = zipfile.ZipFile(BytesIO(request.content))
        z.extractall()
        with open(headers_file, 'w') as f:
            print(last_modified, file=f)
        return z

get_gtfs_data()

def get_real_time_data_request_response(header=False):
    if header:
        r = requests.head('http://www.rtd-denver.com/google_sync/TripUpdate.pb', auth=(os.getenv('RTD_USERNAME'), os.getenv('RTD_PASSWORD')))
        return(r.headers)
    else:
        r = requests.get('http://www.rtd-denver.com/google_sync/TripUpdate.pb', auth=(os.getenv('RTD_USERNAME'), os.getenv('RTD_PASSWORD')))
        if r.ok:
            return(r.content)
        else:
            return None


from flask import Flask, render_template, request
app = Flask(__name__)

@app.route('/')
def main():
    return render_template('index.html')


@app.route('/api')
def get_locations():
    lat = float(request.args.get('lat'))
    lon = float(request.args.get('lon'))
    print(lat, lon)

    trip_headsign='Denver West'
    stop_df = pd.read_csv('./stops.txt')
    stop_df = stop_df.set_index('stop_id')

    df = pd.read_csv('./trips.txt')
    df = df.set_index('trip_id')
    df['trip_headsign'].unique()

    trip_df = df[df['trip_headsign'] == trip_headsign]

    bus_list = list(str(i) for i in trip_df.index)

    feed = gtfs_realtime_pb2.FeedMessage()
    content = get_real_time_data_request_response()
    feed.ParseFromString(content)
    list_entities = []

    for entity in feed.entity:
        if entity.trip_update.trip.trip_id in bus_list:
            list_entities.append(entity)

    list_dict = list()
    for entity in list_entities:
        _dict = stop_df.loc[entity.trip_update.stop_time_update[0].stop_id, ['stop_lat', 'stop_lon']].to_dict()
        _dict['trip_id'] = entity.trip_update.trip.trip_id
        _dict['expected_departure'] = pd.Timestamp(entity.trip_update.stop_time_update[0].departure.time, unit='s', tz='UTC').tz_convert('America/Denver').strftime('%H:%M')
        _dict['stop_id'] = entity.trip_update.stop_time_update[0].stop_id
        list_dict.append(_dict)

    stop_df['user_lat'] = lat
    stop_df['user_lon'] = lon

    dist = stop_df[['stop_lat', 'stop_lon']].values - stop_df[['user_lat', 'user_lon']].values
    stop_df['min_distance'] = dist[:, 0]*dist[:, 0] + dist[:, 1]*dist[:, 1]
    closest_stop_id = stop_df.loc[[d['stop_id'] for d in list_dict], 'min_distance'].argmin()

    for entity in list_entities:
        for stu in entity.trip_update.stop_time_update:
            if stu.stop_id == closest_stop_id:
                print('closest estimated')
                print(pd.Timestamp(stu.departure.time, unit='s', tz='UTC').tz_convert('America/Denver').strftime('%H:%M'))

    return json.dumps(list_dict)


if __name__ == '__main__':

    app.run(debug=True)
