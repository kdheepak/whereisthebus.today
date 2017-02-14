from __future__ import print_function

from google.transit import gtfs_realtime_pb2
import requests
import json
import os
import pandas as pd

from flask import Flask, render_template  # , request
app = Flask(__name__)

COLOR_MAP = {"Union Station": '1b9e77',
             "Anschutz Medical Campus": 'd95f02',
             "Denver West": '7570b3'}


trips_df = pd.read_csv('./google_feeder/trips.txt', index_col=2)


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


@app.route('/')
def main():
    return render_template('index.html')


@app.route('/api')
def get_locations():
    # lat = float(request.args.get('lat', 39.7392))
    # lon = float(request.args.get('lon', -104.9903))

    # tu_feed = gtfs_realtime_pb2.FeedMessage()
    # response = requests.get('http://www.rtd-denver.com/google_sync/TripUpdate.pb', auth=(os.getenv('RTD_USERNAME'), os.getenv('RTD_PASSWORD')))
    # tu_feed.ParseFromString(response.content)
    vp_feed = gtfs_realtime_pb2.FeedMessage()
    response = requests.get('http://www.rtd-denver.com/google_sync/VehiclePosition.pb', auth=(os.getenv('RTD_USERNAME'), os.getenv('RTD_PASSWORD')))
    vp_feed.ParseFromString(response.content)

    vp_list = [vp for vp in vp_feed.entity if vp.vehicle.trip.route_id == '20']

    data = list()
    for vp in vp_list:
        title = trips_df.loc[int(vp.vehicle.trip.trip_id), 'trip_headsign']
        try:
            color = COLOR_MAP[title]
        except:
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


if __name__ == '__main__':

    app.run()
