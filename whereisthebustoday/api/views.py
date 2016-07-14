# -*- coding: utf-8 -*-

from flask import Blueprint, flash, redirect, render_template, request, url_for

import json

from .transit import get_bus_list
from . import transit

from whereisthebustoday.extensions import csrf_protect

blueprint = Blueprint('api', __name__, url_prefix='/api', static_folder='../static')


@csrf_protect.exempt
@blueprint.route('/routes', methods=['GET', 'POST'])
def transit_routes():

    options = sorted(get_bus_list())

    json_data = []

    for item in options:

        json_data.append({'value': item, 'label': item})

    return json.dumps(json_data)

@csrf_protect.exempt
@blueprint.route('/trip_id/<trip_id>', methods=['GET', 'POST'])
def trip_id(trip_id):
    data = transit.get_route_data(trip_id)
    return(json.dumps(data))

@csrf_protect.exempt
@blueprint.route('/trips/', methods=['GET'], defaults={'route_id': None, 'trip_headsign': None})
@blueprint.route('/trips/<route_id>/', methods=['GET'], defaults={'trip_headsign': None})
@blueprint.route('/trips/<route_id>/<trip_headsign>', methods=['GET'])
def trips(route_id, trip_headsign):
    data = transit.get_trips(route_id, trip_headsign)
    return(json.dumps(data))


@blueprint.route('/markers/<route>', methods=['GET'])
def markers(route):
    data = transit.get_all_current_position_markers(route)
    return(json.dumps(data))


@csrf_protect.exempt
@blueprint.route("/route", methods=['GET', 'POST'])
def bus_info():
    if request.method=='POST':
        data = json.loads(request.data)
        print(data)
        route = data['route']
        route_id = route.split(':')[0].strip()
        trip_headsign = route.split(':')[1].strip()
        data = transit.get_trip_ids(route_id, trip_headsign)
        return(json.dumps(data))
    else:
        return("Use post request instead")
