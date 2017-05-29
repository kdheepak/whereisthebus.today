from __future__ import print_function

import matplotlib.cm as cm
from matplotlib.colors import rgb2hex
from google.transit import gtfs_realtime_pb2
import requests
import json
import os
import pandas as pd
from io import BytesIO
import zipfile

from flask import Flask, render_template, request
app = Flask(__name__)

try:
    trips_df = pd.read_csv('./google_feeder/trips.txt', index_col=2)
except Exception as e:
    trips_df = None
    print(e)


def get_gtfs_data():
    url = 'http://www.rtd-denver.com/GoogleFeeder/google_transit.zip'
    request = requests.get(url)
    z = zipfile.ZipFile(BytesIO(request.content))
    z.extractall('google_feeder')
    return z


def get_real_time_data_request_response(header=False):
    if header:
        r = requests.head('http://www.rtd-denver.com/google_sync/VehiclePosition.pb', auth=(os.getenv('RTD_USERNAME'), os.getenv('RTD_PASSWORD')))
        return(r.headers)
    else:
        r = requests.get('http://www.rtd-denver.com/google_sync/VehiclePosition.pb', auth=(os.getenv('RTD_USERNAME'), os.getenv('RTD_PASSWORD')))
        if r.ok:
            return(r.content)
        else:
            return None


@app.route('/refresh')
def refresh():
    get_gtfs_data()
    return json.dumps({'refresh': True})


@app.route('/list')
def list_buses():
    vp_feed = gtfs_realtime_pb2.FeedMessage()
    response = requests.get('http://www.rtd-denver.com/google_sync/VehiclePosition.pb', auth=(os.getenv('RTD_USERNAME'), os.getenv('RTD_PASSWORD')))
    vp_feed.ParseFromString(response.content)
    data = sorted(list(set(vp.vehicle.trip.route_id for vp in vp_feed.entity)))
    return render_template('list.html', bus_list=data)


@app.route('/')
def main():
    route_id = request.args.get('route', '20')
    return render_template('index.html', route_id=route_id)


@app.route('/api')
def get_locations():
    # lat = float(request.args.get('lat', 39.7392))
    # lon = float(request.args.get('lon', -104.9903))
    try:
        route_id = request.args.get('route_id', '20')
    except Exception as e:
        print(e)
        route_id = '20'

    # tu_feed = gtfs_realtime_pb2.FeedMessage()
    # response = requests.get('http://www.rtd-denver.com/google_sync/TripUpdate.pb', auth=(os.getenv('RTD_USERNAME'), os.getenv('RTD_PASSWORD')))
    # tu_feed.ParseFromString(response.content)
    vp_feed = gtfs_realtime_pb2.FeedMessage()
    response = requests.get('http://www.rtd-denver.com/google_sync/VehiclePosition.pb', auth=(os.getenv('RTD_USERNAME'), os.getenv('RTD_PASSWORD')))
    vp_feed.ParseFromString(response.content)

    vp_list = [vp for vp in vp_feed.entity if vp.vehicle.trip.route_id == route_id]

    if trips_df is not None:
        COLOR_MAP = dict()
        titles = sorted(list(set(str(trips_df.loc[int(vp.vehicle.trip.trip_id), 'trip_headsign']) for vp in vp_list)))
        for i, t in enumerate(titles):
            COLOR_MAP[t] = rgb2hex(cm.viridis(i * 1.0 / (len(titles)))[0:-1])
    else:
        COLOR_MAP = None

    data = list()
    for vp in vp_list:
        if trips_df is not None:
            title = trips_df.loc[int(vp.vehicle.trip.trip_id), 'trip_headsign']
        else:
            title = ''
        try:
            color = COLOR_MAP[title]
        except Exception as e:
            print(e)
            color = 'FFFFFF'
        data.append({
            'color': color,
            'lat': vp.vehicle.position.latitude,
            'lon': vp.vehicle.position.longitude,
            'title': title,
            'bearing': vp.vehicle.position.bearing,
            'current_status': vp.vehicle.current_status,
            'direction_id': vp.vehicle.trip.direction_id,
            'route_id': vp.vehicle.trip.route_id,
            'trip_id': vp.vehicle.trip.trip_id,
            'schedule_relationship': vp.vehicle.trip.schedule_relationship,
            'timestamp': vp.vehicle.timestamp})

    return json.dumps(data)


get_gtfs_data()

if __name__ == '__main__':

    app.run()
