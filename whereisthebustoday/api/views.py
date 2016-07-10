# -*- coding: utf-8 -*-

from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask_login import login_required, login_user, logout_user

import json

from .transit import get_bus_list

blueprint = Blueprint('api', __name__, url_prefix='/api', static_folder='../static')


@blueprint.route('/routes', methods=['GET', 'POST'])
def transit_routes():

    options = sorted(get_bus_list())

    json_data = []

    for item in options:

        json_data.append({'value': item, 'label': item})

    return json.dumps(json_data)


