# -*- coding: utf-8 -*-

from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask_login import login_required, login_user, logout_user

import json

from .transit import get_bus_list
from . import transit

blueprint = Blueprint('api', __name__, url_prefix='/api', static_folder='../static')


@blueprint.route('/routes', methods=['GET', 'POST'])
def transit_routes():

    options = sorted(get_bus_list())

    json_data = []

    for item in options:

        json_data.append({'value': item, 'label': item})

    return json.dumps(json_data)

@blueprint.route('/trip_id/<trip_id>', methods=['GET', 'POST'])
def trip_id(trip_id):
    data = transit.get_route_data(trip_id)
    return(json.dumps(data))

@blueprint.route("/route", methods=['GET', 'POST'])
def bus_info():
    print('received route request')
    print(request.args)
    route = request.args.get('route')
    route_id = route.split(':')[0].strip()
    trip_headsign = route.split(':')[1].strip()
    data = get_trip_ids(route_id, trip_headsign)
    return(json.dumps(data))
